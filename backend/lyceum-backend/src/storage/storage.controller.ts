import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StorageService } from './storage.service';
import {
  UploadFileDto,
  CreatePresignedUrlDto,
  FileUploadResponseDto,
  PresignedUrlResponseDto,
} from './dto/upload-file.dto';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {
    this.logger.log('StorageController initialized');
  }

  @Get('status')
  @ApiOperation({ summary: 'Проверка статуса файлового хранилища' })
  @ApiResponse({ status: 200, description: 'Статус сервиса' })
  async getStatus() {
    return {
      success: true,
      message: 'Storage service is running',
      isS3Available: this.storageService.isAvailable(),
      timestamp: new Date().toISOString(),
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Загрузка файла' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: FileUploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @CurrentUser() user: any,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new Error('Файл не предоставлен');
    }

    return this.storageService.uploadFile(file, uploadFileDto, user.id);
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Создание presigned URL для загрузки файла' })
  @ApiResponse({ status: 201, type: PresignedUrlResponseDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPresignedUrl(
    @Body() createPresignedUrlDto: CreatePresignedUrlDto,
    @CurrentUser() user: any,
  ): Promise<PresignedUrlResponseDto> {
    return this.storageService.createPresignedUrl(createPresignedUrlDto, user.id);
  }

  @Get('files/:fileId')
  @ApiOperation({ summary: 'Получение информации о файле' })
  @ApiResponse({ status: 200, description: 'Информация о файле' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFile(@Param('fileId') fileId: string, @CurrentUser() user: any) {
    return this.storageService.getFile(fileId, user.id);
  }

  @Get('files')
  @ApiOperation({ summary: 'Получение списка файлов пользователя' })
  @ApiResponse({ status: 200, description: 'Список файлов' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUserFiles(
    @CurrentUser() user: any,
    @Query('category') category?: string,
  ) {
    return this.storageService.getUserFiles(user.id, category);
  }

  @Delete('files/:fileId')
  @ApiOperation({ summary: 'Удаление файла' })
  @ApiResponse({ status: 200, description: 'Файл удален' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteFile(@Param('fileId') fileId: string, @CurrentUser() user: any) {
    await this.storageService.deleteFile(fileId, user.id);
    return { success: true, message: 'Файл успешно удален' };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Получение списка категорий файлов' })
  @ApiResponse({ status: 200, description: 'Список категорий' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFileCategories() {
    return this.storageService.getFileCategories();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Статистика хранилища пользователя' })
  @ApiResponse({ status: 200, description: 'Статистика' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getStorageStats(@CurrentUser() user: any) {
    return this.storageService.getStorageStats(user.id);
  }
} 