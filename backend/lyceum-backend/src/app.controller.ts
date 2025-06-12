import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    try {
      // Проверяем подключение к базе данных
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
      };
    }
  }

  @Get('test-db')
  async testDb() {
    try {
      const userCount = await this.prisma.user.count();
      return { message: 'Database connection successful', userCount };
    } catch (error) {
      return { message: 'Database connection failed', error: error.message };
    }
  }

  @Get('test-storage')
  @ApiOperation({ summary: 'Тест storage функциональности' })
  testStorage() {
    return {
      success: true,
      message: 'Storage test endpoint works',
      timestamp: new Date().toISOString(),
    };
  }
}
