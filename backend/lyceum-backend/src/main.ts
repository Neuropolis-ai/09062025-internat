import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Статические файлы
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  // Глобальный префикс API
  app.setGlobalPrefix('api/v1');

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3002', 
      'http://localhost:3003',
      'http://localhost:3004'
    ],
    credentials: process.env.CORS_CREDENTIALS === 'true',
  });

  // Swagger документация
  if (process.env.SWAGGER_ENABLED === 'true' || process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Lyceum Backend API')
      .setDescription('API для мобильного приложения Лицей-интернат "Подмосковный"')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`🏠 Главная страница: http://localhost:${port}/`);
  console.log(`🧪 Тестирование API: http://localhost:${port}/api-test.html`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api/docs`);
}

bootstrap();
