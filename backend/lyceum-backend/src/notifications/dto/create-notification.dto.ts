import { IsString, IsEnum, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({ description: 'Заголовок уведомления' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Содержание уведомления' })
  @IsString()
  content: string;

  @ApiProperty({ 
    description: 'Тип уведомления',
    enum: NotificationType,
    default: NotificationType.GENERAL
  })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiProperty({ 
    description: 'Глобальное уведомление для всех пользователей',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;

  @ApiProperty({ 
    description: 'Список ID пользователей для отправки (если не глобальное)',
    type: [String],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  userIds?: string[];
} 