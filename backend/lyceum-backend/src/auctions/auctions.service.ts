import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Auction, AuctionBid, Prisma } from '@prisma/client';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuctionDto: CreateAuctionDto, createdBy: string): Promise<Auction> {
    const startTime = new Date(createAuctionDto.startTime);
    const endTime = new Date(createAuctionDto.endTime);

    // Валидация времени
    if (startTime >= endTime) {
      throw new BadRequestException('Время начала должно быть раньше времени окончания');
    }

    if (startTime < new Date()) {
      throw new BadRequestException('Время начала не может быть в прошлом');
    }

    return this.prisma.auction.create({
      data: {
        title: createAuctionDto.title,
        description: createAuctionDto.description,
        imageUrl: createAuctionDto.imageUrl,
        startingPrice: createAuctionDto.startingPrice,
        currentPrice: createAuctionDto.startingPrice,
        minBidIncrement: createAuctionDto.minBidIncrement || 1,
        startTime,
        endTime,
        createdBy,
        status: 'DRAFT',
      },
    });
  }

  async findAll(): Promise<Auction[]> {
    return this.prisma.auction.findMany({
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        winner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            bids: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Auction> {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        winner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        bids: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!auction) {
      throw new NotFoundException('Аукцион не найден');
    }

    return auction;
  }

  async update(id: string, updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status !== 'DRAFT') {
      throw new BadRequestException('Можно редактировать только черновики аукционов');
    }

    const updateData: any = { ...updateAuctionDto };

    if (updateAuctionDto.startTime) {
      updateData.startTime = new Date(updateAuctionDto.startTime);
    }

    if (updateAuctionDto.endTime) {
      updateData.endTime = new Date(updateAuctionDto.endTime);
    }

    // Валидация времени
    if (updateData.startTime && updateData.endTime && updateData.startTime >= updateData.endTime) {
      throw new BadRequestException('Время начала должно быть раньше времени окончания');
    }

    return this.prisma.auction.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<void> {
    const auction = await this.findOne(id);

    if (auction.status === 'ACTIVE') {
      throw new BadRequestException('Нельзя удалить активный аукцион');
    }

    await this.prisma.auction.delete({
      where: { id },
    });
  }

  async placeBid(auctionId: string, bidderId: string, placeBidDto: PlaceBidDto): Promise<AuctionBid> {
    const auction = await this.findOne(auctionId);

    if (auction.createdBy === bidderId) {
      throw new ForbiddenException('Нельзя делать ставки на собственный аукцион');
    }

    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException('Аукцион не активен');
    }

    if (new Date() > auction.endTime) {
      throw new BadRequestException('Аукцион завершен');
    }

    const minBidAmount = Number(auction.currentPrice) + Number(auction.minBidIncrement);
    if (placeBidDto.amount < minBidAmount) {
      throw new BadRequestException(`Минимальная ставка: ${minBidAmount} L-Coin`);
    }

    // Проверка баланса пользователя через аккаунт
    const userAccount = await this.prisma.account.findFirst({
      where: { 
        userId: bidderId,
        accountType: 'CHECKING'
      },
    });

    if (!userAccount || Number(userAccount.balance) < placeBidDto.amount) {
      throw new BadRequestException('Недостаточно средств');
    }

    // Создание ставки и обновление аукциона в транзакции
    return this.prisma.$transaction(async (prisma) => {
      const bid = await prisma.auctionBid.create({
        data: {
          auctionId,
          userId: bidderId,
          amount: placeBidDto.amount,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      await prisma.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: placeBidDto.amount,
          winnerId: bidderId,
        },
      });

      return bid;
    });
  }

  async getAuctionBids(auctionId: string): Promise<AuctionBid[]> {
    await this.findOne(auctionId); // Проверка существования аукциона

    return this.prisma.auctionBid.findMany({
      where: { auctionId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async closeAuction(auctionId: string): Promise<Auction> {
    const auction = await this.findOne(auctionId);

    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException('Аукцион не активен');
    }

    // Если есть победитель, списываем средства
    if (auction.winnerId) {
      await this.prisma.$transaction(async (prisma) => {
        // Списываем средства с победителя
        await prisma.account.updateMany({
          where: { 
            userId: auction.winnerId!,
            accountType: 'CHECKING'
          },
          data: {
            balance: {
              decrement: auction.currentPrice,
            },
          },
        });

        // Начисляем средства создателю аукциона
        await prisma.account.updateMany({
          where: { 
            userId: auction.createdBy,
            accountType: 'CHECKING'
          },
          data: {
            balance: {
              increment: auction.currentPrice,
            },
          },
        });

        // Создаем транзакции
        await prisma.transaction.createMany({
          data: [
            {
              amount: Number(auction.currentPrice) * -1,
              transactionType: 'DEBIT',
              description: `Покупка лота "${auction.title}" на аукционе`,
              referenceId: auctionId,
              referenceType: 'AUCTION',
              createdBy: auction.winnerId!,
            },
            {
              amount: Number(auction.currentPrice),
              transactionType: 'CREDIT',
              description: `Продажа лота "${auction.title}" на аукционе`,
              referenceId: auctionId,
              referenceType: 'AUCTION',
              createdBy: auction.createdBy,
            },
          ],
        });
      });
    }

    return this.prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: 'COMPLETED',
      },
    });
  }
}
