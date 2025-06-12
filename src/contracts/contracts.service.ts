import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Contract, ContractBid, Prisma } from '@prisma/client';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { SubmitBidDto } from './dto/submit-bid.dto';

@Injectable()
export class ContractsService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto, createdBy: string): Promise<Contract> {
    const deadline = createContractDto.deadline ? new Date(createContractDto.deadline) : null;

    // Валидация крайнего срока
    if (deadline && deadline < new Date()) {
      throw new BadRequestException('Крайний срок не может быть в прошлом');
    }

    return this.prisma.contract.create({
      data: {
        title: createContractDto.title,
        description: createContractDto.description,
        rewardAmount: createContractDto.rewardAmount,
        requirements: createContractDto.requirements,
        category: createContractDto.category,
        deadline,
        maxParticipants: createContractDto.maxParticipants || 1,
        status: 'OPEN',
        createdBy,
      },
    });
  }

  async findAll(): Promise<Contract[]> {
    return this.prisma.contract.findMany({
      include: {
        creator: {
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

  async findOne(id: string): Promise<Contract> {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        creator: {
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
        _count: {
          select: {
            bids: true,
          },
        },
      },
    });

    if (!contract) {
      throw new NotFoundException('Контракт не найден');
    }

    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    const contract = await this.findOne(id);

    if (contract.status === 'COMPLETED') {
      throw new BadRequestException('Нельзя изменить завершенный контракт');
    }

    if (contract.bids.length > 0) {
      throw new BadRequestException('Нельзя изменить контракт с уже поданными заявками');
    }

    const updateData: Prisma.ContractUpdateInput = {};

    if (updateContractDto.title) updateData.title = updateContractDto.title;
    if (updateContractDto.description) updateData.description = updateContractDto.description;
    if (updateContractDto.rewardAmount) updateData.rewardAmount = updateContractDto.rewardAmount;
    if (updateContractDto.requirements) updateData.requirements = updateContractDto.requirements;
    if (updateContractDto.category) updateData.category = updateContractDto.category;
    if (updateContractDto.deadline) updateData.deadline = new Date(updateContractDto.deadline);
    if (updateContractDto.maxParticipants) updateData.maxParticipants = updateContractDto.maxParticipants;

    return this.prisma.contract.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<Contract> {
    const contract = await this.findOne(id);

    if (contract.status === 'IN_PROGRESS') {
      throw new BadRequestException('Нельзя удалить контракт в работе');
    }

    return this.prisma.contract.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async submitBid(contractId: string, userId: string, submitBidDto: SubmitBidDto): Promise<ContractBid> {
    const contract = await this.findOne(contractId);

    // Проверки
    if (contract.status !== 'OPEN') {
      throw new BadRequestException('Контракт не открыт для заявок');
    }

    if (contract.deadline && new Date() > contract.deadline) {
      throw new BadRequestException('Срок подачи заявок истек');
    }

    if (contract.createdBy === userId) {
      throw new ForbiddenException('Нельзя подавать заявки на собственный контракт');
    }

    // Проверяем, не подавал ли пользователь уже заявку
    const existingBid = await this.prisma.contractBid.findFirst({
      where: {
        contractId,
        userId,
      },
    });

    if (existingBid) {
      throw new BadRequestException('Вы уже подали заявку на этот контракт');
    }

    // Проверяем лимит участников
    if (contract.bids.length >= contract.maxParticipants) {
      throw new BadRequestException('Достигнуто максимальное количество участников');
    }

    return this.prisma.contractBid.create({
      data: {
        contractId,
        userId,
        proposedPrice: submitBidDto.proposedPrice,
        comment: submitBidDto.comment,
        status: 'PENDING',
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
  }

  async acceptBid(contractId: string, bidId: string): Promise<ContractBid> {
    const contract = await this.findOne(contractId);
    
    if (contract.status !== 'OPEN') {
      throw new BadRequestException('Контракт не открыт');
    }

    const bid = await this.prisma.contractBid.findUnique({
      where: { id: bidId },
      include: {
        user: true,
      },
    });

    if (!bid || bid.contractId !== contractId) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (bid.status !== 'PENDING') {
      throw new BadRequestException('Заявка уже обработана');
    }

    return this.prisma.$transaction(async (tx) => {
      // Принимаем заявку
      const acceptedBid = await tx.contractBid.update({
        where: { id: bidId },
        data: { status: 'ACCEPTED' },
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

      // Отклоняем остальные заявки
      await tx.contractBid.updateMany({
        where: {
          contractId,
          id: { not: bidId },
          status: 'PENDING',
        },
        data: { status: 'REJECTED' },
      });

      // Обновляем статус контракта
      await tx.contract.update({
        where: { id: contractId },
        data: { status: 'IN_PROGRESS' },
      });

      return acceptedBid;
    });
  }

  async completeContract(contractId: string, userId: string): Promise<Contract> {
    const contract = await this.findOne(contractId);

    if (contract.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Контракт не в работе');
    }

    // Находим принятую заявку
    const acceptedBid = await this.prisma.contractBid.findFirst({
      where: {
        contractId,
        status: 'ACCEPTED',
      },
      include: {
        user: true,
      },
    });

    if (!acceptedBid) {
      throw new NotFoundException('Принятая заявка не найдена');
    }

    return this.prisma.$transaction(async (tx) => {
      // Обновляем статус контракта
      const completedContract = await tx.contract.update({
        where: { id: contractId },
        data: { status: 'COMPLETED' },
      });

      // Начисляем вознаграждение исполнителю
      const userAccount = await tx.account.findFirst({
        where: {
          userId: acceptedBid.userId,
          accountType: 'CHECKING',
        },
      });

      if (userAccount) {
        await tx.account.update({
          where: { id: userAccount.id },
          data: {
            balance: {
              increment: acceptedBid.proposedPrice,
            },
          },
        });

        // Создаем запись о транзакции
        await tx.transaction.create({
          data: {
            toAccountId: userAccount.id,
            amount: acceptedBid.proposedPrice,
            transactionType: 'CREDIT',
            description: `Вознаграждение за выполнение контракта: ${contract.title}`,
            referenceId: contractId,
            referenceType: 'CONTRACT',
            status: 'COMPLETED',
            processedAt: new Date(),
            createdBy: userId,
          },
        });
      }

      return completedContract;
    });
  }

  async getContractBids(contractId: string): Promise<ContractBid[]> {
    const contract = await this.findOne(contractId);

    return this.prisma.contractBid.findMany({
      where: { contractId },
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

  async getUserBids(userId: string): Promise<ContractBid[]> {
    return this.prisma.contractBid.findMany({
      where: { userId },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            description: true,
            rewardAmount: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
} 