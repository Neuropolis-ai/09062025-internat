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
        status: startTime > new Date() ? 'DRAFT' : 'ACTIVE',
        createdBy,
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
        bids: {
          orderBy: {
            placedAt: 'desc',
          },
          take: 1,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
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
          orderBy: {
            placedAt: 'desc',
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

    if (auction.status === 'COMPLETED') {
      throw new BadRequestException('Нельзя изменить завершенный аукцион');
    }

    if (auction.bids.length > 0) {
      throw new BadRequestException('Нельзя изменить аукцион с уже размещенными ставками');
    }

    const updateData: Prisma.AuctionUpdateInput = {};

    if (updateAuctionDto.title) updateData.title = updateAuctionDto.title;
    if (updateAuctionDto.description) updateData.description = updateAuctionDto.description;
    if (updateAuctionDto.imageUrl) updateData.imageUrl = updateAuctionDto.imageUrl;
    if (updateAuctionDto.startingPrice) {
      updateData.startingPrice = updateAuctionDto.startingPrice;
      updateData.currentPrice = updateAuctionDto.startingPrice;
    }
    if (updateAuctionDto.minBidIncrement) updateData.minBidIncrement = updateAuctionDto.minBidIncrement;
    if (updateAuctionDto.startTime) updateData.startTime = new Date(updateAuctionDto.startTime);
    if (updateAuctionDto.endTime) updateData.endTime = new Date(updateAuctionDto.endTime);

    return this.prisma.auction.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Auction> {
    const auction = await this.findOne(id);

    if (auction.status === 'ACTIVE' && auction.bids.length > 0) {
      throw new BadRequestException('Нельзя удалить активный аукцион со ставками');
    }

    return this.prisma.auction.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async placeBid(auctionId: string, userId: string, placeBidDto: PlaceBidDto): Promise<AuctionBid> {
    const auction = await this.findOne(auctionId);

    // Проверки
    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException('Аукцион не активен');
    }

    if (new Date() > auction.endTime) {
      throw new BadRequestException('Аукцион завершен');
    }

    if (auction.createdBy === userId) {
      throw new ForbiddenException('Нельзя делать ставки на собственный аукцион');
    }

    const minBidAmount = Number(auction.currentPrice) + Number(auction.minBidIncrement);
    if (placeBidDto.amount < minBidAmount) {
      throw new BadRequestException(`Минимальная ставка: ${minBidAmount} L-Coin`);
    }

    // Проверяем баланс пользователя
    const userAccount = await this.prisma.account.findFirst({
      where: {
        userId,
        accountType: 'CHECKING',
      },
    });

    if (!userAccount || Number(userAccount.balance) < placeBidDto.amount) {
      throw new BadRequestException('Недостаточно средств на счете');
    }

    // Создаем ставку и обновляем аукцион в транзакции
    return this.prisma.$transaction(async (tx) => {
      // Создаем ставку
      const bid = await tx.auctionBid.create({
        data: {
          auctionId,
          userId,
          amount: placeBidDto.amount,
          comment: placeBidDto.comment,
          placedAt: new Date(),
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

      // Обновляем текущую цену аукциона
      await tx.auction.update({
        where: { id: auctionId },
        data: {
          currentPrice: placeBidDto.amount,
        },
      });

      return bid;
    });
  }

  async getAuctionBids(auctionId: string): Promise<AuctionBid[]> {
    const auction = await this.findOne(auctionId);

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
        placedAt: 'desc',
      },
    });
  }

  async closeAuction(auctionId: string): Promise<Auction> {
    const auction = await this.findOne(auctionId);

    if (auction.status !== 'ACTIVE') {
      throw new BadRequestException('Аукцион не активен');
    }

    // Находим победителя (последняя самая высокая ставка)
    const winningBid = await this.prisma.auctionBid.findFirst({
      where: { auctionId },
      orderBy: [
        { amount: 'desc' },
        { placedAt: 'asc' },
      ],
    });

    return this.prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: 'COMPLETED',
        winnerId: winningBid?.userId || null,
      },
    });
  }
} 