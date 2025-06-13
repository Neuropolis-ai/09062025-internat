import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Param,
  UseGuards,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { 
  SendEmailDto, 
  TestEmailDto, 
  EmailSettingsDto, 
  EmailStatusResponseDto 
} from './dto/email.dto';
import { EmailType } from './types/email.types';

@ApiTags('Email')
@Controller('email')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('status')
  @ApiOperation({ summary: 'Получить статус email сервиса' })
  @ApiResponse({ 
    status: 200, 
    description: 'Статус email сервиса',
    type: EmailStatusResponseDto 
  })
  async getStatus(): Promise<EmailStatusResponseDto> {
    const stats = await this.emailService.getEmailStats();
    const isSmtpAvailable = await this.emailService.testConnection();

    return {
      success: true,
      message: 'Email service is running',
      isSmtpAvailable,
      queueSize: stats.queue.waiting + stats.queue.active,
      stats: {
        sent: stats.queue.completed,
        failed: stats.queue.failed,
        pending: stats.queue.waiting,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Получить подробную статистику email' })
  @ApiResponse({ status: 200, description: 'Статистика email отправки' })
  async getStats() {
    const stats = await this.emailService.getEmailStats();
    
    return {
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить email уведомление' })
  @ApiResponse({ status: 200, description: 'Email отправлен успешно' })
  @ApiResponse({ status: 400, description: 'Ошибка при отправке email' })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    const result = await this.emailService.sendEmail({
      to: sendEmailDto.to,
      subject: sendEmailDto.subject,
      type: sendEmailDto.type,
      data: sendEmailDto.data,
    });

    return {
      success: result,
      message: result ? 'Email отправлен успешно' : 'Email добавлен в очередь',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить тестовое email' })
  @ApiResponse({ status: 200, description: 'Тестовое email отправлено' })
  async sendTestEmail(@Body() testEmailDto: TestEmailDto) {
    const emailType = testEmailDto.type || EmailType.SYSTEM_NOTIFICATION;
    
    // Данные для тестового письма
    const testData = {
      firstName: 'Тестовый',
      lastName: 'Пользователь',
      innl: '123456',
      className: '8А',
      cottageName: 'Коттедж №1',
      loginUrl: 'https://lyceum.app/login',
      productName: 'Тестовый товар',
      quantity: 1,
      totalAmount: 10,
      remainingBalance: 90,
      purchaseDate: new Date().toLocaleDateString('ru-RU'),
      auctionTitle: 'Тестовый аукцион',
      winningBid: 50,
      paymentAmount: 50,
      auctionEndDate: new Date().toLocaleDateString('ru-RU'),
      contractTitle: 'Тестовый контракт',
      rewardAmount: 100,
      requirements: 'Выполнить тестовое задание',
      contractUrl: 'https://lyceum.app/contracts/test',
      amount: 25,
      newBalance: 125,
      reason: 'Тестовое пополнение',
      date: new Date().toLocaleDateString('ru-RU'),
      title: 'Тестовое уведомление',
      message: 'Это тестовое email уведомление для проверки работы системы.',
      resetUrl: 'https://lyceum.app/reset-password/test-token',
      expiresIn: '24 часа',
    };

    const result = await this.emailService.sendEmail({
      to: testEmailDto.email,
      subject: 'Тестовое уведомление - Лицей',
      type: emailType,
      data: testData,
    });

    return {
      success: result,
      message: result ? 
        `Тестовое email отправлено на ${testEmailDto.email}` : 
        'Тестовое email добавлено в очередь',
      type: emailType,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('settings')
  @ApiOperation({ summary: 'Получить настройки email уведомлений пользователя' })
  @ApiResponse({ status: 200, description: 'Настройки уведомлений' })
  async getEmailSettings(@CurrentUser() user: any) {
    // В будущем можно добавить модель UserEmailSettings в Prisma
    // Пока возвращаем дефолтные настройки
    return {
      success: true,
      data: {
        userId: user.id,
        purchaseNotifications: true,
        auctionNotifications: true,
        contractNotifications: true,
        systemNotifications: true,
        balanceNotifications: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Put('settings')
  @ApiOperation({ summary: 'Обновить настройки email уведомлений' })
  @ApiResponse({ status: 200, description: 'Настройки обновлены' })
  async updateEmailSettings(
    @CurrentUser() user: any,
    @Body() settingsDto: EmailSettingsDto,
  ) {
    // В будущем можно добавить сохранение в БД
    // Пока просто возвращаем обновленные настройки
    return {
      success: true,
      message: 'Настройки email уведомлений обновлены',
      data: {
        userId: user.id,
        ...settingsDto,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('templates')
  @ApiOperation({ summary: 'Получить список доступных email шаблонов' })
  @ApiResponse({ status: 200, description: 'Список шаблонов' })
  async getTemplates() {
    const templates = Object.values(EmailType);
    
    return {
      success: true,
      data: {
        total: templates.length,
        templates: templates.map(type => ({
          type,
          name: this.getTemplateName(type),
          description: this.getTemplateDescription(type),
        })),
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('welcome/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить приветственное email новому пользователю' })
  @ApiResponse({ status: 200, description: 'Приветственное email отправлено' })
  async sendWelcomeEmail(@Param('userId') userId: string) {
    // В реальном приложении здесь будет получение данных пользователя из БД
    const result = await this.emailService.sendWelcomeEmail(
      'test@example.com', // В реальности - email пользователя из БД
      {
        firstName: 'Новый',
        lastName: 'Пользователь',
        innl: '123456',
        className: '8А',
        cottageName: 'Коттедж №1',
        loginUrl: 'https://lyceum.app/login',
      }
    );

    return {
      success: result,
      message: result ? 'Приветственное email отправлено' : 'Email добавлен в очередь',
      timestamp: new Date().toISOString(),
    };
  }

  private getTemplateName(type: EmailType): string {
    const names = {
      [EmailType.WELCOME]: 'Добро пожаловать',
      [EmailType.PURCHASE]: 'Покупка совершена',
      [EmailType.AUCTION_WIN]: 'Победа в аукционе',
      [EmailType.AUCTION_OUTBID]: 'Перебили на аукционе',
      [EmailType.CONTRACT_AVAILABLE]: 'Новый контракт',
      [EmailType.CONTRACT_ACCEPTED]: 'Контракт принят',
      [EmailType.BALANCE_TOPUP]: 'Пополнение баланса',
      [EmailType.PASSWORD_RESET]: 'Сброс пароля',
      [EmailType.ACCOUNT_LOCKED]: 'Аккаунт заблокирован',
      [EmailType.SYSTEM_NOTIFICATION]: 'Системное уведомление',
    };
    return names[type] || type;
  }

  private getTemplateDescription(type: EmailType): string {
    const descriptions = {
      [EmailType.WELCOME]: 'Отправляется новым пользователям при регистрации',
      [EmailType.PURCHASE]: 'Уведомление о совершенной покупке в L-shop',
      [EmailType.AUCTION_WIN]: 'Поздравление с победой в аукционе',
      [EmailType.AUCTION_OUTBID]: 'Уведомление о том, что ставку перебили',
      [EmailType.CONTRACT_AVAILABLE]: 'Уведомление о новом доступном контракте',
      [EmailType.CONTRACT_ACCEPTED]: 'Подтверждение принятия заявки на контракт',
      [EmailType.BALANCE_TOPUP]: 'Уведомление о пополнении баланса L-Coin',
      [EmailType.PASSWORD_RESET]: 'Ссылка для сброса пароля',
      [EmailType.ACCOUNT_LOCKED]: 'Уведомление о блокировке аккаунта',
      [EmailType.SYSTEM_NOTIFICATION]: 'Общие системные уведомления',
    };
    return descriptions[type] || 'Описание отсутствует';
  }
} 