import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { 
  UploadFileDto, 
  CreatePresignedUrlDto, 
  FileUploadResponseDto, 
  PresignedUrlResponseDto,
  FileVisibility
} from '../storage/dto/upload-file.dto';

// Enum для статуса файла
enum FileStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: AWS.S3 | null = null;
  private bucketName: string = '';
  private region: string = '';
  private publicUrl: string = '';
  private isS3Initialized = false;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.logger.log('StorageService dependencies initialized');
    // Инициализируем S3 асинхронно, не блокируя загрузку модуля
    this.initializeS3();
  }

  private async initializeS3() {
    try {
      const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
      const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');
      const endpoint = this.configService.get<string>('S3_ENDPOINT') || 'https://s3.timeweb.com';
      this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || 'lyceum-files';
      this.region = this.configService.get<string>('S3_REGION') || 'ru-1';
      this.publicUrl = this.configService.get<string>('S3_PUBLIC_URL') || `${endpoint}/${this.bucketName}`;

      if (!accessKeyId || !secretAccessKey) {
        this.logger.warn('S3 credentials not found. File storage functionality will be disabled.');
        this.isS3Initialized = true; // Помечаем как инициализированный, но без S3
        return;
      }

      this.s3 = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        endpoint,
        region: this.region,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      });

      this.isS3Initialized = true;
      this.logger.log(`S3 client initialized successfully with endpoint: ${endpoint}`);
    } catch (error) {
      this.logger.error('Failed to initialize S3 client:', error?.message || error);
      this.isS3Initialized = true; // Помечаем как инициализированный, но с ошибкой
    }
  }

  private checkS3Available(): void {
    if (!this.s3) {
      throw new BadRequestException('Файловое хранилище недоступно. Проверьте конфигурацию S3.');
    }
  }

  async uploadFile(file: Express.Multer.File, uploadFileDto: UploadFileDto, uploadedBy: string): Promise<FileUploadResponseDto> {
    this.checkS3Available();

    const fileId = uuidv4();
    const originalName = uploadFileDto.filename || file.originalname;
    const category = uploadFileDto.category || 'general';
    const visibility = uploadFileDto.visibility || FileVisibility.PRIVATE;
    
    // Генерируем уникальное имя файла
    const fileExtension = originalName.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${category}/${timestamp}-${fileId}.${fileExtension}`;

    try {
      // Загружаем файл в S3
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          'original-name': originalName,
          'uploaded-by': uploadedBy,
          'file-id': fileId,
          'category': category,
          'visibility': visibility,
        },
      };

      // Если файл публичный, делаем его доступным для чтения
      if (visibility === FileVisibility.PUBLIC) {
        uploadParams.ACL = 'public-read';
      }

      const result = await this.s3!.upload(uploadParams).promise();

      // Сохраняем информацию о файле в БД
      const fileRecord = await this.prisma.file.create({
        data: {
          id: fileId,
          filename: originalName,
          s3Key: fileName,
          size: file.size,
          mimeType: file.mimetype,
          visibility,
          category,
          description: uploadFileDto.description,
          uploadedBy,
          s3Url: result.Location,
          uploadStatus: FileStatus.COMPLETED,
        },
      });

      const response: FileUploadResponseDto = {
        id: fileRecord.id,
        filename: fileRecord.filename,
        size: fileRecord.size,
        mimeType: fileRecord.mimeType,
        url: await this.generatePresignedUrl(fileName, 3600), // 1 час
        uploadedAt: fileRecord.uploadedAt,
      };

      if (visibility === FileVisibility.PUBLIC) {
        response.publicUrl = `${this.publicUrl}/${fileName}`;
      }

      this.logger.log(`File uploaded successfully: ${fileId}`);
      return response;
    } catch (error) {
      this.logger.error('Failed to upload file:', error);
      throw new BadRequestException('Ошибка при загрузке файла');
    }
  }

  async createPresignedUrl(createPresignedUrlDto: CreatePresignedUrlDto, userId: string): Promise<PresignedUrlResponseDto> {
    this.checkS3Available();

    const fileId = uuidv4();
    const category = createPresignedUrlDto.category || 'general';
    const visibility = createPresignedUrlDto.visibility || FileVisibility.PRIVATE;
    
    // Генерируем уникальное имя файла
    const fileExtension = createPresignedUrlDto.filename.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${category}/${timestamp}-${fileId}.${fileExtension}`;

    try {
      // Создаем presigned POST URL
      const presignedPost = this.s3!.createPresignedPost({
        Bucket: this.bucketName,
        Fields: {
          key: fileName,
          'Content-Type': createPresignedUrlDto.contentType,
        },
        Expires: 900, // 15 минут
        Conditions: [
          { bucket: this.bucketName },
          { key: fileName },
          { 'Content-Type': createPresignedUrlDto.contentType },
          ['content-length-range', 0, 100 * 1024 * 1024], // Максимум 100MB
        ],
      });

      // Создаем запись в БД с PENDING статусом
      await this.prisma.file.create({
        data: {
          id: fileId,
          filename: createPresignedUrlDto.filename,
          s3Key: fileName,
          size: 0, // Будет обновлен после загрузки
          mimeType: createPresignedUrlDto.contentType,
          visibility,
          category,
          uploadedBy: userId,
          s3Url: '', // Будет обновлен после загрузки
          uploadStatus: FileStatus.PENDING,
        },
      });

      return {
        uploadUrl: presignedPost.url,
        fields: presignedPost.fields,
        fileId,
        expiresIn: 900,
      };
    } catch (error) {
      this.logger.error('Failed to create presigned URL:', error);
      throw new BadRequestException('Ошибка при создании URL для загрузки');
    }
  }

  async getFile(fileId: string, userId: string): Promise<any> {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new NotFoundException('Файл не найден');
      }

      // Проверяем права доступа
      if (file.visibility === FileVisibility.PRIVATE && file.uploadedBy !== userId) {
        throw new NotFoundException('Файл не найден');
      }

      // Генерируем URL для доступа
      let url: string;
      if (file.visibility === FileVisibility.PUBLIC) {
        url = `${this.publicUrl}/${file.s3Key}`;
      } else {
        url = await this.generatePresignedUrl(file.s3Key, 3600);
      }

      return {
        ...file,
        url,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Failed to get file:', error);
      throw new BadRequestException('Ошибка при получении файла');
    }
  }

  async getUserFiles(userId: string, category?: string): Promise<any[]> {
    try {
      const where: any = { uploadedBy: userId };
      if (category) {
        where.category = category;
      }

      const files = await this.prisma.file.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
      });

      // Генерируем URLs для всех файлов
      return Promise.all(
        files.map(async (file) => {
          let url: string;
          if (file.visibility === FileVisibility.PUBLIC) {
            url = `${this.publicUrl}/${file.s3Key}`;
          } else {
            url = await this.generatePresignedUrl(file.s3Key, 3600);
          }

          return {
            ...file,
            url,
          };
        })
      );
    } catch (error) {
      this.logger.error('Failed to get user files:', error);
      return [];
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        throw new NotFoundException('Файл не найден');
      }

      if (file.uploadedBy !== userId) {
        throw new BadRequestException('Нет прав для удаления файла');
      }

      // Удаляем из S3
      if (this.s3) {
        await this.s3.deleteObject({
          Bucket: this.bucketName,
          Key: file.s3Key,
        }).promise();
      }

      // Удаляем из БД
      await this.prisma.file.delete({
        where: { id: fileId },
      });

      this.logger.log(`File deleted: ${fileId}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Failed to delete file:', error);
      throw new BadRequestException('Ошибка при удалении файла');
    }
  }

  private async generatePresignedUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.s3) {
      throw new BadRequestException('S3 недоступен');
    }

    try {
      return this.s3.getSignedUrl('getObject', {
        Bucket: this.bucketName,
        Key: s3Key,
        Expires: expiresIn,
      });
    } catch (error) {
      this.logger.error('Failed to generate presigned URL:', error);
      throw new BadRequestException('Ошибка при генерации URL');
    }
  }

  async getFileCategories(): Promise<string[]> {
    try {
      const result = await this.prisma.file.findMany({
        select: { category: true },
        distinct: ['category'],
      });

      return result.map((r) => r.category).filter(Boolean);
    } catch (error) {
      this.logger.error('Failed to get file categories:', error);
      return ['general', 'documents', 'images', 'videos', 'avatars'];
    }
  }

  async getStorageStats(userId: string): Promise<any> {
    try {
      const stats = await this.prisma.file.aggregate({
        where: { uploadedBy: userId },
        _sum: { size: true },
        _count: { id: true },
      });

      return {
        totalFiles: stats._count.id || 0,
        totalSize: stats._sum.size || 0,
        totalSizeMB: Math.round((stats._sum.size || 0) / (1024 * 1024) * 100) / 100,
        isS3Available: !!this.s3,
      };
    } catch (error) {
      this.logger.error('Failed to get storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        totalSizeMB: 0,
        isS3Available: !!this.s3,
      };
    }
  }

  isAvailable(): boolean {
    return this.isS3Initialized;
  }
} 