import { Injectable, BadRequestException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatMessageDto, ChatWithHistoryDto, ChatResponseDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private openai: OpenAI;
  private readonly model = 'gpt-3.5-turbo';
  private readonly maxTokens = 1000;
  private readonly temperature = 0.7;

  // Rate limiting: простая реализация в памяти
  private userRequestCounts = new Map<string, { count: number; resetTime: number }>();
  private readonly maxRequestsPerHour = 20;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (!apiKey) {
      this.logger.warn('OpenAI API key not found. Chat functionality will be disabled.');
      return;
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });

    this.logger.log('OpenAI service initialized successfully');
  }

  private checkRateLimit(userId: string): void {
    const now = Date.now();
    const userLimit = this.userRequestCounts.get(userId);

    if (!userLimit || now > userLimit.resetTime) {
      // Сброс лимита каждый час
      this.userRequestCounts.set(userId, {
        count: 1,
        resetTime: now + 60 * 60 * 1000, // +1 час
      });
      return;
    }

    if (userLimit.count >= this.maxRequestsPerHour) {
      throw new HttpException(
        `Превышен лимит запросов. Максимум ${this.maxRequestsPerHour} запросов в час.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    userLimit.count++;
  }

  private getLyceumContext(): string {
    return `Ты - виртуальный помощник лицея-интерната "Подмосковный". 

КОНТЕКСТ ЛИЦЕЯ:
- Лицей-интернат "Подмосковный" - престижное учебное заведение
- Обучаются студенты 8-11 классов
- Есть система коттеджей для проживания
- Действует внутренняя экономическая система с валютой L-Coin
- Есть L-shop для покупок товаров за L-Coin
- Проводятся аукционы и госконтракты
- Студенты могут зарабатывать L-Coin за достижения и активность

ТВОЯ РОЛЬ:
- Помогай студентам с вопросами о лицее
- Объясняй правила и процедуры
- Поддерживай дружелюбный и профессиональный тон
- Если не знаешь точного ответа, честно скажи об этом
- Не давай советы по личным проблемам - направляй к психологу или администрации

ОГРАНИЧЕНИЯ:
- Не обсуждай политику, религию, взрослый контент
- Не давай медицинские советы
- Не помогай с нарушением правил лицея
- Отвечай кратко и по существу (максимум 500 слов)

Отвечай на русском языке.`;
  }

  async sendMessage(userId: string, chatMessageDto: ChatMessageDto): Promise<ChatResponseDto> {
    if (!this.openai) {
      throw new BadRequestException('Сервис чата временно недоступен');
    }

    this.checkRateLimit(userId);

    const startTime = Date.now();

    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: this.getLyceumContext(),
        },
        {
          role: 'user',
          content: chatMessageDto.message,
        },
      ];

      // Добавляем дополнительный контекст если указан
      if (chatMessageDto.context) {
        messages.splice(1, 0, {
          role: 'system',
          content: `Дополнительный контекст: ${chatMessageDto.context}`,
        });
      }

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        user: userId, // Для отслеживания пользователей в OpenAI
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new BadRequestException('Не удалось получить ответ от нейросети');
      }

      const responseTime = Date.now() - startTime;

      this.logger.log(`Chat response generated for user ${userId} in ${responseTime}ms`);

      return {
        response: response.trim(),
        responseTime,
        tokensUsed: completion.usage?.total_tokens || 0,
        model: this.model,
        timestamp: new Date(),
      };

    } catch (error) {
      this.logger.error(`OpenAI API error for user ${userId}:`, error);
      
      if (error.status === 429) {
        throw new HttpException(
          'Сервис временно перегружен. Попробуйте позже.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (error.status === 400) {
        throw new BadRequestException('Некорректный запрос к нейросети');
      }

      throw new HttpException(
        'Ошибка при обращении к нейросети',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendMessageWithHistory(
    userId: string, 
    chatWithHistoryDto: ChatWithHistoryDto
  ): Promise<ChatResponseDto> {
    if (!this.openai) {
      throw new BadRequestException('Сервис чата временно недоступен');
    }

    this.checkRateLimit(userId);

    const startTime = Date.now();

    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: this.getLyceumContext(),
        },
      ];

      // Добавляем дополнительный контекст если указан
      if (chatWithHistoryDto.context) {
        messages.push({
          role: 'system',
          content: `Дополнительный контекст: ${chatWithHistoryDto.context}`,
        });
      }

      // Добавляем историю сообщений
      if (chatWithHistoryDto.history && chatWithHistoryDto.history.length > 0) {
        // Ограничиваем историю последними 10 сообщениями для экономии токенов
        const recentHistory = chatWithHistoryDto.history.slice(-10);
        
        for (const historyMessage of recentHistory) {
          messages.push({
            role: historyMessage.role,
            content: historyMessage.content,
          });
        }
      }

      // Добавляем новое сообщение
      messages.push({
        role: 'user',
        content: chatWithHistoryDto.message,
      });

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        user: userId,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new BadRequestException('Не удалось получить ответ от нейросети');
      }

      const responseTime = Date.now() - startTime;

      this.logger.log(`Chat response with history generated for user ${userId} in ${responseTime}ms`);

      return {
        response: response.trim(),
        responseTime,
        tokensUsed: completion.usage?.total_tokens || 0,
        model: this.model,
        timestamp: new Date(),
      };

    } catch (error) {
      this.logger.error(`OpenAI API error for user ${userId}:`, error);
      
      if (error.status === 429) {
        throw new HttpException(
          'Сервис временно перегружен. Попробуйте позже.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      if (error.status === 400) {
        throw new BadRequestException('Некорректный запрос к нейросети');
      }

      throw new HttpException(
        'Ошибка при обращении к нейросети',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRemainingRequests(userId: string): Promise<{ remaining: number; resetTime: Date }> {
    const userLimit = this.userRequestCounts.get(userId);
    
    if (!userLimit || Date.now() > userLimit.resetTime) {
      return {
        remaining: this.maxRequestsPerHour,
        resetTime: new Date(Date.now() + 60 * 60 * 1000),
      };
    }

    return {
      remaining: Math.max(0, this.maxRequestsPerHour - userLimit.count),
      resetTime: new Date(userLimit.resetTime),
    };
  }

  isAvailable(): boolean {
    return !!this.openai;
  }
}
