import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { 
  EmailType, 
  EmailData, 
  EmailConfig, 
  WelcomeEmailData,
  PurchaseEmailData,
  AuctionWinEmailData,
  AuctionOutbidEmailData,
  ContractEmailData,
  BalanceTopupEmailData,
  PasswordResetEmailData,
  SystemNotificationEmailData
} from './types/email.types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private isSmtpInitialized = false;
  private templates: Map<EmailType, handlebars.HandlebarsTemplateDelegate> = new Map();

  // Rate limiting в памяти (в production лучше использовать Redis)
  private emailCounts: Map<string, { hourly: number; daily: number; lastReset: Date }> = new Map();

  constructor(
    private configService: ConfigService,
    @InjectQueue('email') private emailQueue: Queue,
  ) {
    this.logger.log('EmailService dependencies initialized');
    this.initializeSmtp();
    this.loadTemplates();
  }

  private async initializeSmtp() {
    try {
      const smtpHost = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
      const smtpPort = this.configService.get<number>('SMTP_PORT') || 587;
      const smtpUser = this.configService.get<string>('SMTP_USER');
      const smtpPass = this.configService.get<string>('SMTP_PASS');

      if (!smtpUser || !smtpPass) {
        this.logger.warn('SMTP credentials not found. Email functionality will be disabled.');
        this.isSmtpInitialized = true;
        return;
      }

      this.transporter = nodemailer.createTransporter({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // Проверяем подключение
      await this.transporter.verify();
      this.isSmtpInitialized = true;
      this.logger.log(`SMTP initialized successfully: ${smtpHost}:${smtpPort}`);
    } catch (error) {
      this.logger.error('Failed to initialize SMTP:', error?.message || error);
      this.isSmtpInitialized = true; // Помечаем как инициализированный, но с ошибкой
    }
  }

  private loadTemplates() {
    const templatesDir = path.join(__dirname, 'templates');
    
    const templateFiles = {
      [EmailType.WELCOME]: 'welcome.html',
      [EmailType.PURCHASE]: 'purchase.html',
      [EmailType.AUCTION_WIN]: 'auction-win.html',
      [EmailType.AUCTION_OUTBID]: 'auction-outbid.html',
      [EmailType.CONTRACT_AVAILABLE]: 'contract-available.html',
      [EmailType.CONTRACT_ACCEPTED]: 'contract-accepted.html',
      [EmailType.BALANCE_TOPUP]: 'balance-topup.html',
      [EmailType.PASSWORD_RESET]: 'password-reset.html',
      [EmailType.SYSTEM_NOTIFICATION]: 'system-notification.html',
    };

    for (const [type, filename] of Object.entries(templateFiles)) {
      try {
        const templatePath = path.join(templatesDir, filename);
        if (fs.existsSync(templatePath)) {
          const templateContent = fs.readFileSync(templatePath, 'utf8');
          this.templates.set(type as EmailType, handlebars.compile(templateContent));
        } else {
          // Создаем базовый шаблон если файл не найден
          this.templates.set(type as EmailType, handlebars.compile(this.getDefaultTemplate(type as EmailType)));
        }
      } catch (error) {
        this.logger.warn(`Failed to load template ${filename}:`, error?.message);
        this.templates.set(type as EmailType, handlebars.compile(this.getDefaultTemplate(type as EmailType)));
      }
    }

    this.logger.log(`Loaded ${this.templates.size} email templates`);
  }

  private getDefaultTemplate(type: EmailType): string {
    const baseTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>{{subject}}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8f9fa; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #3498db; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Лицей-интернат "Подмосковный"</h1>
        </div>
        <div class="content">
          {{content}}
        </div>
        <div class="footer">
          <p>С уважением,<br>Администрация лицея</p>
        </div>
      </body>
      </html>
    `;

    const contentMap = {
      [EmailType.WELCOME]: '<h2>Добро пожаловать, {{firstName}}!</h2><p>Ваш аккаунт успешно создан.</p>',
      [EmailType.PURCHASE]: '<h2>Покупка совершена</h2><p>Вы купили {{productName}} за {{totalAmount}} L-Coin.</p>',
      [EmailType.AUCTION_WIN]: '<h2>Поздравляем с победой!</h2><p>Вы выиграли аукцион "{{auctionTitle}}" с ставкой {{winningBid}} L-Coin.</p>',
      [EmailType.AUCTION_OUTBID]: '<h2>Вас перебили на аукционе</h2><p>Ваша ставка {{yourBid}} L-Coin превышена на "{{auctionTitle}}".</p>',
      [EmailType.CONTRACT_AVAILABLE]: '<h2>Новый госконтракт</h2><p>Доступен контракт "{{contractTitle}}" с вознаграждением {{rewardAmount}} L-Coin.</p>',
      [EmailType.CONTRACT_ACCEPTED]: '<h2>Ваша заявка принята</h2><p>Заявка на контракт "{{contractTitle}}" одобрена.</p>',
      [EmailType.BALANCE_TOPUP]: '<h2>Баланс пополнен</h2><p>Ваш баланс пополнен на {{amount}} L-Coin. Причина: {{reason}}.</p>',
      [EmailType.PASSWORD_RESET]: '<h2>Сброс пароля</h2><p>Для сброса пароля перейдите по ссылке: <a href="{{resetUrl}}">Сбросить пароль</a></p>',
      [EmailType.SYSTEM_NOTIFICATION]: '<h2>{{title}}</h2><p>{{message}}</p>',
    };

    return baseTemplate.replace('{{content}}', contentMap[type] || '<p>{{message}}</p>');
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('SMTP not available, queueing email for later');
      await this.queueEmail(emailData);
      return false;
    }

    // Проверяем rate limiting
    if (!this.checkRateLimit(emailData.to)) {
      throw new BadRequestException('Превышен лимит отправки email');
    }

    try {
      const template = this.templates.get(emailData.type);
      if (!template) {
        throw new Error(`Template not found for type: ${emailData.type}`);
      }

      const html = template({
        subject: emailData.subject,
        ...emailData.data,
      });

      const fromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'Лицей-интернат "Подмосковный"';
      const fromAddress = this.configService.get<string>('EMAIL_FROM_ADDRESS') || this.configService.get<string>('SMTP_USER');

      const mailOptions = {
        from: `${fromName} <${fromAddress}>`,
        to: emailData.to,
        subject: emailData.subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.updateRateLimit(emailData.to);
      
      this.logger.log(`Email sent successfully to ${emailData.to} (type: ${emailData.type})`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${emailData.to}:`, error?.message || error);
      // Добавляем в очередь для повторной попытки
      await this.queueEmail(emailData);
      return false;
    }
  }

  private async queueEmail(emailData: EmailData) {
    try {
      await this.emailQueue.add('send-email', emailData, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 10,
        removeOnFail: 5,
      });
      this.logger.log(`Email queued for ${emailData.to} (type: ${emailData.type})`);
    } catch (error) {
      this.logger.error('Failed to queue email:', error?.message || error);
    }
  }

  private checkRateLimit(email: string): boolean {
    const now = new Date();
    const limits = this.emailCounts.get(email);
    
    if (!limits) {
      return true;
    }

    // Сброс счетчиков если прошел час/день
    const hoursPassed = (now.getTime() - limits.lastReset.getTime()) / (1000 * 60 * 60);
    if (hoursPassed >= 1) {
      limits.hourly = 0;
    }
    if (hoursPassed >= 24) {
      limits.daily = 0;
    }

    const maxPerHour = this.configService.get<number>('EMAIL_RATE_LIMIT_HOUR') || 10;
    const maxPerDay = this.configService.get<number>('EMAIL_RATE_LIMIT_DAY') || 50;

    return limits.hourly < maxPerHour && limits.daily < maxPerDay;
  }

  private updateRateLimit(email: string) {
    const now = new Date();
    const limits = this.emailCounts.get(email) || { hourly: 0, daily: 0, lastReset: now };
    
    limits.hourly++;
    limits.daily++;
    limits.lastReset = now;
    
    this.emailCounts.set(email, limits);
  }

  // Методы для различных типов уведомлений
  async sendWelcomeEmail(to: string, data: WelcomeEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Добро пожаловать в лицей!',
      type: EmailType.WELCOME,
      data,
    });
  }

  async sendPurchaseEmail(to: string, data: PurchaseEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Покупка в L-shop совершена',
      type: EmailType.PURCHASE,
      data,
    });
  }

  async sendAuctionWinEmail(to: string, data: AuctionWinEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Поздравляем с победой в аукционе!',
      type: EmailType.AUCTION_WIN,
      data,
    });
  }

  async sendAuctionOutbidEmail(to: string, data: AuctionOutbidEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Вас перебили на аукционе',
      type: EmailType.AUCTION_OUTBID,
      data,
    });
  }

  async sendContractAvailableEmail(to: string, data: ContractEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Новый госконтракт доступен!',
      type: EmailType.CONTRACT_AVAILABLE,
      data,
    });
  }

  async sendBalanceTopupEmail(to: string, data: BalanceTopupEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Баланс L-Coin пополнен',
      type: EmailType.BALANCE_TOPUP,
      data,
    });
  }

  async sendPasswordResetEmail(to: string, data: PasswordResetEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Сброс пароля',
      type: EmailType.PASSWORD_RESET,
      data,
    });
  }

  async sendSystemNotificationEmail(to: string, data: SystemNotificationEmailData): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: data.title,
      type: EmailType.SYSTEM_NOTIFICATION,
      data,
    });
  }

  // Служебные методы
  async getEmailStats(): Promise<any> {
    try {
      const waiting = await this.emailQueue.getWaiting();
      const active = await this.emailQueue.getActive();
      const completed = await this.emailQueue.getCompleted();
      const failed = await this.emailQueue.getFailed();

      return {
        queue: {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
        },
        smtp: {
          available: !!this.transporter,
          initialized: this.isSmtpInitialized,
        },
        templates: {
          loaded: this.templates.size,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get email stats:', error?.message || error);
      return {
        queue: { waiting: 0, active: 0, completed: 0, failed: 0 },
        smtp: { available: false, initialized: false },
        templates: { loaded: 0 },
      };
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      this.logger.error('SMTP connection test failed:', error?.message || error);
      return false;
    }
  }

  isAvailable(): boolean {
    return this.isSmtpInitialized;
  }
} 