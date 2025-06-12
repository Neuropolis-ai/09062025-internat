import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum FileVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export class UploadFileDto {
  @ApiPropertyOptional({ description: 'Имя файла (если отличается от оригинального)' })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiPropertyOptional({ description: 'Категория файла', example: 'documents' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Видимость файла', enum: FileVisibility })
  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;

  @ApiPropertyOptional({ description: 'Описание файла' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePresignedUrlDto {
  @ApiProperty({ description: 'Имя файла', example: 'document.pdf' })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({ description: 'Тип содержимого', example: 'application/pdf' })
  @IsNotEmpty()
  @IsString()
  contentType: string;

  @ApiPropertyOptional({ description: 'Категория файла', example: 'documents' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Видимость файла', enum: FileVisibility })
  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'ID файла' })
  id: string;

  @ApiProperty({ description: 'Имя файла' })
  filename: string;

  @ApiProperty({ description: 'Размер файла в байтах' })
  size: number;

  @ApiProperty({ description: 'MIME тип файла' })
  mimeType: string;

  @ApiProperty({ description: 'Временный URL для доступа к файлу' })
  url: string;

  @ApiPropertyOptional({ description: 'Публичный URL (если файл публичный)' })
  publicUrl?: string;

  @ApiProperty({ description: 'Дата загрузки' })
  uploadedAt: Date;
}

export class PresignedUrlResponseDto {
  @ApiProperty({ description: 'URL для загрузки файла' })
  uploadUrl: string;

  @ApiProperty({ description: 'Поля для POST запроса' })
  fields: Record<string, string>;

  @ApiProperty({ description: 'ID файла' })
  fileId: string;

  @ApiProperty({ description: 'Время истечения URL в секундах' })
  expiresIn: number;
} 