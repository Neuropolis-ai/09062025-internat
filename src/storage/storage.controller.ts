import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '@prisma/client';
import { StorageService } from './storage.service';
import {
  UploadFileDto,
  CreatePresignedUrlDto,
  FileUploadResponseDto,
  PresignedUrlResponseDto,
} from './dto/upload-file.dto';

@ApiTags('storage')
@Controller('storage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('status')
  @ApiOperation({ summary: 'Проверка доступности файлового хранилища' })
  @ApiResponse({ status: 200, description: 'Статус файлового хранилища' })
  async getStatus() {
    return {
      available: this.storageService.isAvailable(),
      message: this.storageService.isAvailable() 
        ? 'Файловое хранилище доступно' 
        : 'Файловое хранилище недоступно. Проверьте конфигурацию S3.',
    };
  }

  @Post('upload')
  @ApiOperation({ summary: 'Загрузка файла' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 201, 
    description: 'Файл успешно загружен',
    type: FileUploadResponseDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @CurrentUser() user: User,
  ): Promise<FileUploadResponseDto> {
    return this.storageService.uploadFile(file, uploadFileDto, user.id);
  }

  @Post('presigned-url')
  @ApiOperation({ summary: 'Создание presigned URL для загрузки файла' })
  @ApiResponse({ 
    status: 200, 
    description: 'Presigned URL создан успешно',
    type: PresignedUrlResponseDto,
  })
  async createPresignedUrl(
    @Body() createPresignedUrlDto: CreatePresignedUrlDto,
    @CurrentUser() user: User,
  ): Promise<PresignedUrlResponseDto> {
    return this.storageService.createPresignedUrl(createPresignedUrlDto, user.id);
  }

  @Get('files')
  @ApiOperation({ summary: 'Получение списка файлов пользователя' })
  @ApiQuery({ name: 'category', required: false, description: 'Фильтр по категории' })
  @ApiResponse({ status: 200, description: 'Список файлов' })
  async getUserFiles(
    @CurrentUser() user: User,
    @Query('category') category?: string,
  ) {
    return this.storageService.getUserFiles(user.id, category);
  }

  @Get('files/:id')
  @ApiOperation({ summary: 'Получение информации о файле' })
  @ApiResponse({ status: 200, description: 'Информация о файле' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async getFile(
    @Param('id') fileId: string,
    @CurrentUser() user: User,
  ) {
    return this.storageService.getFile(fileId, user.id);
  }

  @Delete('files/:id')
  @ApiOperation({ summary: 'Удаление файла' })
  @ApiResponse({ status: 204, description: 'Файл успешно удален' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(
    @Param('id') fileId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.storageService.deleteFile(fileId, user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Получение списка категорий файлов' })
  @ApiResponse({ status: 200, description: 'Список категорий' })
  async getCategories() {
    return this.storageService.getFileCategories();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получение статистики по файлам пользователя' })
  @ApiResponse({ status: 200, description: 'Статистика файлов' })
  async getStorageStats(@CurrentUser() user: User) {
    return this.storageService.getStorageStats(user.id);
  }
} 