import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createFromDto(createUserDto: CreateUserDto): Promise<User> {
    const innl = await this.generateInnl();
    
    const userData: Prisma.UserCreateInput = {
      ...createUserDto,
      innl,
      birthDate: createUserDto.birthDate ? new Date(createUserDto.birthDate) : undefined,
    };

    return this.create(userData);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    // Генерируем ИННЛ если не передан
    if (!data.innl) {
      data.innl = await this.generateInnl();
    }

    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        class: true,
        cottage: true,
        accounts: true,
      },
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        class: true,
        cottage: true,
        accounts: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
        positions: {
          include: {
            position: true,
          },
        },
        belongings: {
          include: {
            belonging: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByInnl(innl: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { innl },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async generateInnl(): Promise<string> {
    // Генерируем уникальный ИННЛ (Лицейский ИНН)
    let innl = '';
    let exists = true;

    while (exists) {
      innl = Math.floor(100000 + Math.random() * 900000).toString();
      const user = await this.findByInnl(innl);
      exists = !!user;
    }

    return innl;
  }

  async addBalance(userId: string, amount: number): Promise<any> {
    const user = await this.findOne(userId);
    
    // Получаем расчетный счет пользователя
    const checkingAccount = await this.prisma.account.findFirst({
      where: {
        userId,
        accountType: 'CHECKING',
      },
    });

    if (!checkingAccount) {
      throw new Error('Расчетный счет не найден');
    }

    // Пополняем баланс
    const updatedAccount = await this.prisma.account.update({
      where: { id: checkingAccount.id },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    // Создаем запись о транзакции
    await this.prisma.transaction.create({
      data: {
        toAccountId: checkingAccount.id,
        amount,
        transactionType: 'CREDIT',
        description: `Пополнение баланса на ${amount} L-Coin`,
        status: 'COMPLETED',
        processedAt: new Date(),
        createdBy: userId,
      },
    });

    return {
      message: `Баланс пополнен на ${amount} L-Coin`,
      newBalance: Number(updatedAccount.balance),
      accountNumber: updatedAccount.accountNumber,
    };
  }
} 