import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [AuctionsController],
  providers: [AuctionsService, PrismaService],
  exports: [AuctionsService],
})
export class AuctionsModule {} 