import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';

export enum FileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export class UploadFileDto {
  @ApiProperty({ 
    description: 'Имя файла (опционально)',
    example: 'document.pdf',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  filename?: string;

  @ApiProperty({ 
    description: 'Категория файла',
    example: 'documents',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({ 
    description: 'Видимость файла',
    enum: FileVisibility,
    example: FileVisibility.PRIVATE,
    required: false
  })
  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;

  @ApiProperty({ 
    description: 'Описание файла',
    example: 'Важный документ для проекта',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class CreatePresignedUrlDto {
  @ApiProperty({ 
    description: 'Имя файла', 
    example: 'document.pdf' 
  })
  @IsString()
  @MaxLength(255)
  filename: string;

  @ApiProperty({ 
    description: 'Тип содержимого файла',
    example: 'application/pdf'
  })
  @IsString()
  contentType: string;

  @ApiProperty({ 
    description: 'Категория файла',
    example: 'documents',
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({ 
    description: 'Видимость файла',
    enum: FileVisibility,
    example: FileVisibility.PRIVATE,
    required: false
  })
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

  @ApiProperty({ description: 'Тип содержимого' })
  mimeType: string;

  @ApiProperty({ description: 'URL для доступа к файлу' })
  url: string;

  @ApiProperty({ description: 'Публичный URL (если файл публичный)' })
  publicUrl?: string;

  @ApiProperty({ description: 'Дата загрузки' })
  uploadedAt: Date;
}

export class PresignedUrlResponseDto {
  @ApiProperty({ description: 'Presigned URL для загрузки' })
  uploadUrl: string;

  @ApiProperty({ description: 'Поля для формы загрузки' })
  fields: Record<string, string>;

  @ApiProperty({ description: 'ID файла для последующего использования' })
  fileId: string;

  @ApiProperty({ description: 'Время истечения URL в секундах' })
  expiresIn: number;
} 