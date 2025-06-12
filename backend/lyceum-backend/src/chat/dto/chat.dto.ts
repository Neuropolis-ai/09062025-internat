import { IsString, IsNotEmpty, IsOptional, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ 
    description: 'Сообщение пользователя', 
    example: 'Расскажи мне о правилах лицея' 
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Сообщение не может быть длиннее 1000 символов' })
  message: string;

  @ApiProperty({ 
    description: 'Контекст беседы (опционально)', 
    example: 'education',
    required: false 
  })
  @IsOptional()
  @IsString()
  context?: string;
}

export class ChatHistoryMessageDto {
  @ApiProperty({ description: 'Роль отправителя', enum: ['user', 'assistant'] })
  @IsString()
  @IsNotEmpty()
  role: 'user' | 'assistant';

  @ApiProperty({ description: 'Содержание сообщения' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ChatWithHistoryDto {
  @ApiProperty({ 
    description: 'Новое сообщение пользователя', 
    example: 'А что насчет дресс-кода?' 
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message: string;

  @ApiProperty({ 
    description: 'История предыдущих сообщений',
    type: [ChatHistoryMessageDto],
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryMessageDto)
  history?: ChatHistoryMessageDto[];

  @ApiProperty({ 
    description: 'Контекст беседы', 
    required: false 
  })
  @IsOptional()
  @IsString()
  context?: string;
}

export class ChatResponseDto {
  @ApiProperty({ description: 'Ответ нейросети' })
  response: string;

  @ApiProperty({ description: 'Время ответа в миллисекундах' })
  responseTime: number;

  @ApiProperty({ description: 'Использованные токены' })
  tokensUsed: number;

  @ApiProperty({ description: 'Модель, которая использовалась' })
  model: string;

  @ApiProperty({ description: 'Timestamp ответа' })
  timestamp: Date;
}
