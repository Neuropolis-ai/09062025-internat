import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { AuctionsGateway } from './auctions.gateway';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [
    JwtModule.register({}), // Для WebSocket JWT аутентификации
    ConfigModule,
  ],
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionsGateway, PrismaService],
  exports: [AuctionsService, AuctionsGateway],
})
export class AuctionsModule {}
