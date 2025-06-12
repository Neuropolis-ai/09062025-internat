import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { ChatMessageDto, ChatWithHistoryDto, ChatResponseDto } from './dto/chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('status')
  @ApiOperation({ summary: 'Проверить доступность чата' })
  @ApiResponse({ status: 200, description: 'Статус сервиса чата' })
  async getStatus() {
    return {
      available: this.chatService.isAvailable(),
      message: this.chatService.isAvailable() 
        ? 'Сервис чата доступен' 
        : 'Сервис чата временно недоступен',
    };
  }

  @Get('limits')
  @ApiOperation({ summary: 'Получить информацию о лимитах запросов' })
  @ApiResponse({ status: 200, description: 'Информация о лимитах' })
  async getLimits(@CurrentUser() user: User) {
    const limits = await this.chatService.getRemainingRequests(user.id);
    return {
      remaining: limits.remaining,
      resetTime: limits.resetTime,
      maxRequestsPerHour: 20,
    };
  }

  @Post('message')
  @ApiOperation({ summary: 'Отправить сообщение нейросети' })
  @ApiResponse({ 
    status: 200, 
    description: 'Ответ от нейросети',
    type: ChatResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Некорректное сообщение' })
  @ApiResponse({ status: 429, description: 'Превышен лимит запросов' })
  @ApiResponse({ status: 503, description: 'Сервис чата недоступен' })
  async sendMessage(
    @Body() chatMessageDto: ChatMessageDto,
    @CurrentUser() user: User,
  ): Promise<ChatResponseDto> {
    return this.chatService.sendMessage(user.id, chatMessageDto);
  }

  @Post('conversation')
  @ApiOperation({ summary: 'Отправить сообщение с историей беседы' })
  @ApiResponse({ 
    status: 200, 
    description: 'Ответ от нейросети с учетом истории',
    type: ChatResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Некорректное сообщение или история' })
  @ApiResponse({ status: 429, description: 'Превышен лимит запросов' })
  @ApiResponse({ status: 503, description: 'Сервис чата недоступен' })
  async sendMessageWithHistory(
    @Body() chatWithHistoryDto: ChatWithHistoryDto,
    @CurrentUser() user: User,
  ): Promise<ChatResponseDto> {
    return this.chatService.sendMessageWithHistory(user.id, chatWithHistoryDto);
  }
}
