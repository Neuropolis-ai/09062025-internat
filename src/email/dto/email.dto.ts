import { IsEmail, IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmailType } from '../types/email.types';

export class SendEmailDto {
  @ApiProperty({ description: 'Email получателя' })
  @IsEmail()
  to: string;

  @ApiProperty({ description: 'Тема письма' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Тип email шаблона', enum: EmailType })
  @IsEnum(EmailType)
  type: EmailType;

  @ApiProperty({ description: 'Данные для шаблона' })
  @IsObject()
  data: Record<string, any>;
}

export class TestEmailDto {
  @ApiProperty({ description: 'Email для тестирования' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Тип тестового письма', enum: EmailType, required: false })
  @IsOptional()
  @IsEnum(EmailType)
  type?: EmailType;
}

export class EmailSettingsDto {
  @ApiProperty({ description: 'Получать уведомления о покупках', default: true })
  @IsOptional()
  purchaseNotifications?: boolean;

  @ApiProperty({ description: 'Получать уведомления об аукционах', default: true })
  @IsOptional()
  auctionNotifications?: boolean;

  @ApiProperty({ description: 'Получать уведомления о контрактах', default: true })
  @IsOptional()
  contractNotifications?: boolean;

  @ApiProperty({ description: 'Получать системные уведомления', default: true })
  @IsOptional()
  systemNotifications?: boolean;

  @ApiProperty({ description: 'Получать уведомления о балансе', default: true })
  @IsOptional()
  balanceNotifications?: boolean;
}

export class EmailStatusResponseDto {
  @ApiProperty({ description: 'Статус email сервиса' })
  success: boolean;

  @ApiProperty({ description: 'Сообщение о статусе' })
  message: string;

  @ApiProperty({ description: 'Доступность SMTP' })
  isSmtpAvailable: boolean;

  @ApiProperty({ description: 'Количество писем в очереди' })
  queueSize: number;

  @ApiProperty({ description: 'Статистика отправки' })
  stats: {
    sent: number;
    failed: number;
    pending: number;
  };

  @ApiProperty({ description: 'Время ответа' })
  timestamp: string;
} 