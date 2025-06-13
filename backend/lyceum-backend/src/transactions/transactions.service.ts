import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateTransactionDto, TransactionType } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { userId, type, amount, description, category, referenceId, referenceType } = createTransactionDto;

    // Получаем аккаунт пользователя
    const userAccount = await this.prisma.account.findFirst({
      where: { 
        userId,
        accountType: 'CHECKING'
      }
    });

    if (!userAccount) {
      throw new Error('Аккаунт пользователя не найден');
    }

    // Начинаем транзакцию в базе данных
    return await this.prisma.$transaction(async (prisma) => {
      let transactionData: any = {
        amount,
        description: description || '',
        referenceId,
        referenceType: referenceType as any,
        transactionType: type,
        status: 'COMPLETED',
        processedAt: new Date(),
        createdBy: userId,
      };

      if (type === TransactionType.CREDIT || type === TransactionType.REWARD) {
        // Поступление на счет
        transactionData.toAccountId = userAccount.id;
        
        // Обновляем баланс
        await prisma.account.update({
          where: { id: userAccount.id },
          data: {
            balance: {
              increment: amount
            }
          }
        });
      } else if (type === TransactionType.DEBIT || type === TransactionType.PURCHASE) {
        // Списание со счета
        transactionData.fromAccountId = userAccount.id;
        
        // Проверяем достаточность средств
        if (Number(userAccount.balance) < amount) {
          throw new Error('Недостаточно средств на счете');
        }
        
        // Обновляем баланс
        await prisma.account.update({
          where: { id: userAccount.id },
          data: {
            balance: {
              decrement: amount
            }
          }
        });
      }

      // Создаем запись транзакции
      const transaction = await prisma.transaction.create({
        data: transactionData,
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              middleName: true,
            }
          },
          fromAccount: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  middleName: true,
                }
              }
            }
          },
          toAccount: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  middleName: true,
                }
              }
            }
          }
        }
      });

      return transaction;
    });
  }

  async findAll(filters: {
    userId?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const { userId, type, limit = 50, offset = 0 } = filters;

    const where: any = {};
    if (type) where.transactionType = type;
    
    // Если указан userId, ищем транзакции где пользователь участвует
    if (userId) {
      where.OR = [
        {
          fromAccount: {
            userId: userId
          }
        },
        {
          toAccount: {
            userId: userId
          }
        }
      ];
    }

    return await this.prisma.transaction.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
          }
        },
        fromAccount: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              }
            }
          }
        },
        toAccount: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    return await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
          }
        },
        fromAccount: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              }
            }
          }
        },
        toAccount: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
              }
            }
          }
        }
      }
    });
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return await this.prisma.transaction.update({
      where: { id },
      data: {
        description: updateTransactionDto.description,
        // Другие поля можно обновлять только в особых случаях
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
          }
        }
      }
    });
  }

  async remove(id: string) {
    return await this.prisma.transaction.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    // Общая статистика
    const totalUsers = await this.prisma.user.count({
      where: { role: 'STUDENT' }
    });

    const totalTokensResult = await this.prisma.account.aggregate({
      where: { 
        accountType: 'CHECKING',
        user: {
          role: 'STUDENT'
        }
      },
      _sum: {
        balance: true,
      }
    });

    const totalTokens = totalTokensResult._sum?.balance || 0;

    // Транзакции за сегодня
    const todayTransactions = await this.prisma.transaction.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Доходы и расходы за неделю
    const weeklyIncome = await this.prisma.transaction.aggregate({
      where: {
        transactionType: {
          in: ['CREDIT', 'REWARD']
        },
        createdAt: {
          gte: weekAgo
        }
      },
      _sum: {
        amount: true
      }
    });

    const weeklyExpense = await this.prisma.transaction.aggregate({
      where: {
        transactionType: {
          in: ['DEBIT', 'PURCHASE']
        },
        createdAt: {
          gte: weekAgo
        }
      },
      _sum: {
        amount: true
      }
    });

    return {
      totalTokens: Number(totalTokens),
      totalUsers,
      todayTransactions,
      weeklyIncome: Number(weeklyIncome._sum?.amount || 0),
      weeklyExpense: Number(weeklyExpense._sum?.amount || 0),
    };
  }
} 