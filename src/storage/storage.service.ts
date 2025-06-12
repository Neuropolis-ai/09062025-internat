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
} from './dto/upload-file.dto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3: AWS.S3;
  private bucketName: string;
  private region: string;
  private publicUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    this.initializeS3();
  }

  private initializeS3() {
    try {
      const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY');
      const secretAccessKey = this.configService.get<string>('S3_SECRET_KEY');
      const endpoint = this.configService.get<string>('S3_ENDPOINT') || 'https://s3.timeweb.com';
      this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || 'lyceum-files';
      this.region = this.configService.get<string>('S3_REGION') || 'ru-1';
      this.publicUrl = this.configService.get<string>('S3_PUBLIC_URL') || `${endpoint}/${this.bucketName}`;

      if (!accessKeyId || !secretAccessKey) {
        this.logger.warn('S3 credentials not found. File storage functionality will be disabled.');
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

      this.logger.log('S3 client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize S3 client:', error.message);
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

      const result = await this.s3.upload(uploadParams).promise();

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
      // Создаем запись в БД заранее
      await this.prisma.file.create({
        data: {
          id: fileId,
          filename: createPresignedUrlDto.filename,
          s3Key: fileName,
          size: 0, // Будет обновлено после загрузки
          mimeType: createPresignedUrlDto.contentType,
          visibility,
          category,
          uploadedBy: userId,
          s3Url: `${this.publicUrl}/${fileName}`,
          uploadStatus: 'PENDING',
        },
      });

      // Создаем presigned POST URL
      const postPolicy = {
        expiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 минут
        conditions: [
          { bucket: this.bucketName },
          { key: fileName },
          { 'Content-Type': createPresignedUrlDto.contentType },
          ['content-length-range', 0, 100 * 1024 * 1024], // Максимум 100MB
        ],
      };

      const params = {
        Bucket: this.bucketName,
        Fields: {
          key: fileName,
          'Content-Type': createPresignedUrlDto.contentType,
        },
        Expires: 900, // 15 минут
        Conditions: postPolicy.conditions,
      };

      const presignedPost = this.s3.createPresignedPost(params);

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
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    // Проверяем права доступа
    if (file.visibility === FileVisibility.PRIVATE && file.uploadedBy !== userId) {
      throw new NotFoundException('Файл не найден');
    }

    const response = {
      id: file.id,
      filename: file.filename,
      size: file.size,
      mimeType: file.mimeType,
      category: file.category,
      description: file.description,
      visibility: file.visibility,
      uploadedAt: file.uploadedAt,
      uploader: file.uploader,
    };

    // Генерируем URL для доступа
    if (file.visibility === FileVisibility.PUBLIC) {
      (response as any).publicUrl = `${this.publicUrl}/${file.s3Key}`;
    }

    (response as any).url = await this.generatePresignedUrl(file.s3Key, 3600);

    return response;
  }

  async getUserFiles(userId: string, category?: string): Promise<any[]> {
    const whereClause: any = { uploadedBy: userId };
    
    if (category) {
      whereClause.category = category;
    }

    const files = await this.prisma.file.findMany({
      where: whereClause,
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        filename: true,
        size: true,
        mimeType: true,
        category: true,
        visibility: true,
        uploadedAt: true,
      },
    });

    return Promise.all(files.map(async (file) => ({
      ...file,
      url: await this.generatePresignedUrl(file.s3Key, 3600),
      publicUrl: file.visibility === FileVisibility.PUBLIC 
        ? `${this.publicUrl}/${file.s3Key}` 
        : undefined,
    })));
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('Файл не найден');
    }

    if (file.uploadedBy !== userId) {
      throw new NotFoundException('Файл не найден');
    }

    try {
      // Удаляем файл из S3
      if (this.s3) {
        await this.s3.deleteObject({
          Bucket: this.bucketName,
          Key: file.s3Key,
        }).promise();
      }

      // Удаляем запись из БД
      await this.prisma.file.delete({
        where: { id: fileId },
      });

      this.logger.log(`File ${fileId} deleted successfully`);
    } catch (error) {
      this.logger.error('Failed to delete file:', error);
      throw new BadRequestException('Ошибка при удалении файла');
    }
  }

  private async generatePresignedUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.s3) {
      return '';
    }

    try {
      const params = {
        Bucket: this.bucketName,
        Key: s3Key,
        Expires: expiresIn,
      };

      return this.s3.getSignedUrl('getObject', params);
    } catch (error) {
      this.logger.error('Failed to generate presigned URL:', error);
      return '';
    }
  }

  async getFileCategories(): Promise<string[]> {
    const categories = await this.prisma.file.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map(c => c.category);
  }

  async getStorageStats(userId: string): Promise<any> {
    const stats = await this.prisma.file.aggregate({
      where: { uploadedBy: userId },
      _count: { _all: true },
      _sum: { size: true },
    });

    const categoryCounts = await this.prisma.file.groupBy({
      by: ['category'],
      where: { uploadedBy: userId },
      _count: { _all: true },
      _sum: { size: true },
    });

    return {
      totalFiles: stats._count._all,
      totalSize: stats._sum.size || 0,
      categories: categoryCounts.map(cat => ({
        category: cat.category,
        count: cat._count._all,
        size: cat._sum.size || 0,
      })),
    };
  }

  isAvailable(): boolean {
    return !!this.s3;
  }
} 