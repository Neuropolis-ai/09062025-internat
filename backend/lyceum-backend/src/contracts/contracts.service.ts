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
        createdBy,
        status: 'OPEN',
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
      },
    });

    if (!contract) {
      throw new NotFoundException('Контракт не найден');
    }

    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    const contract = await this.findOne(id);

    if (contract.status !== 'OPEN') {
      throw new BadRequestException('Можно редактировать только открытые контракты');
    }

    const updateData: any = { ...updateContractDto };

    if (updateContractDto.deadline) {
      updateData.deadline = new Date(updateContractDto.deadline);
    }

    // Валидация крайнего срока
    if (updateData.deadline && updateData.deadline < new Date()) {
      throw new BadRequestException('Крайний срок не может быть в прошлом');
    }

    return this.prisma.contract.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<void> {
    const contract = await this.findOne(id);

    if (contract.status === 'IN_PROGRESS') {
      throw new BadRequestException('Нельзя удалить контракт в работе');
    }

    await this.prisma.contract.delete({
      where: { id },
    });
  }

  async submitBid(contractId: string, bidderId: string, submitBidDto: SubmitBidDto): Promise<ContractBid> {
    const contract = await this.findOne(contractId);

    if (contract.createdBy === bidderId) {
      throw new ForbiddenException('Нельзя подавать заявки на собственный контракт');
    }

    if (contract.status !== 'OPEN') {
      throw new BadRequestException('Контракт не открыт для заявок');
    }

    if (contract.deadline && new Date() > contract.deadline) {
      throw new BadRequestException('Срок подачи заявок истек');
    }

    // Проверка, не подавал ли пользователь уже заявку
    const existingBid = await this.prisma.contractBid.findFirst({
      where: {
        contractId,
        userId: bidderId,
      },
    });

    if (existingBid) {
      throw new BadRequestException('Вы уже подали заявку на этот контракт');
    }

    // Проверка лимита участников
    const bidsCount = await this.prisma.contractBid.count({
      where: { contractId },
    });

    if (bidsCount >= contract.maxParticipants) {
      throw new BadRequestException('Достигнуто максимальное количество участников');
    }

    return this.prisma.contractBid.create({
      data: {
        contractId,
        userId: bidderId,
        bidAmount: submitBidDto.bidAmount,
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

  async getContractBids(contractId: string): Promise<ContractBid[]> {
    await this.findOne(contractId); // Проверка существования контракта

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

  async acceptBid(contractId: string, bidId: string): Promise<ContractBid> {
    const contract = await this.findOne(contractId);
    
    if (contract.status !== 'OPEN') {
      throw new BadRequestException('Контракт не открыт');
    }

    const bid = await this.prisma.contractBid.findUnique({
      where: { id: bidId },
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

    if (!bid || bid.contractId !== contractId) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (bid.status !== 'PENDING') {
      throw new BadRequestException('Заявка уже обработана');
    }

    // Принимаем заявку и переводим контракт в работу
    return this.prisma.$transaction(async (prisma) => {
      // Обновляем статус заявки
      const updatedBid = await prisma.contractBid.update({
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

      // Отклоняем все остальные заявки
      await prisma.contractBid.updateMany({
        where: {
          contractId,
          id: { not: bidId },
          status: 'PENDING',
        },
        data: { status: 'REJECTED' },
      });

      // Переводим контракт в работу
      await prisma.contract.update({
        where: { id: contractId },
        data: { status: 'IN_PROGRESS' },
      });

      return updatedBid;
    });
  }

  async completeContract(contractId: string): Promise<Contract> {
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
    });

    if (!acceptedBid) {
      throw new BadRequestException('Не найдена принятая заявка');
    }

    // Переводим средства исполнителю
    await this.prisma.$transaction(async (prisma) => {
      // Начисляем средства исполнителю
      await prisma.account.updateMany({
        where: {
          userId: acceptedBid.userId,
          accountType: 'CHECKING',
        },
        data: {
          balance: {
            increment: acceptedBid.bidAmount,
          },
        },
      });

      // Создаем транзакцию
      await prisma.transaction.create({
        data: {
          amount: Number(acceptedBid.bidAmount),
          transactionType: 'CREDIT',
          description: `Выполнение контракта "${contract.title}"`,
          referenceId: contractId,
          referenceType: 'CONTRACT',
          createdBy: contract.createdBy,
        },
      });
    });

    return this.prisma.contract.update({
      where: { id: contractId },
      data: { status: 'COMPLETED' },
    });
  }
}
