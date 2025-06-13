import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuctionsModule } from './auctions/auctions.module';
import { ContractsModule } from './contracts/contracts.module';
import { ChatModule } from './chat/chat.module';
import { StorageModule } from './storage/storage.module';
import { EmailModule } from './email/email.module';
import { configValidation } from './config/config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: configValidation,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    AuctionsModule,
    ContractsModule,
    ChatModule,
    StorageModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 