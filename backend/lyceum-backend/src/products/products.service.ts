import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PurchaseProductDto } from './dto/purchase-product.dto';
import { Product, User, TransactionType, PurchaseStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, createdBy: string): Promise<Product> {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        imageUrl: createProductDto.imageUrl,
        stockQuantity: createProductDto.stock || -1, // -1 = неограниченно
        isActive: createProductDto.isActive ?? true,
        createdBy,
      },
    });
  }

  async findAll(includeInactive = false): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        stockQuantity: updateProductDto.stock,
      },
    });
  }

  async remove(id: string): Promise<Product> {
    const product = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async purchase(userId: string, purchaseDto: PurchaseProductDto): Promise<any> {
    const { productId, quantity = 1, comment } = purchaseDto;

    // Проверяем товар
    const product = await this.findOne(productId);
    
    if (!product.isActive) {
      throw new BadRequestException('Товар недоступен для покупки');
    }

    if (product.stockQuantity !== -1 && product.stockQuantity < quantity) {
      throw new BadRequestException('Недостаточно товара в наличии');
    }

    // Получаем пользователя с расчетным счетом
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: { accountType: 'CHECKING' },
        },
      },
    });

    if (!user || user.accounts.length === 0) {
      throw new NotFoundException('Расчетный счет пользователя не найден');
    }

    const checkingAccount = user.accounts[0];
    const totalCost = Number(product.price) * quantity;

    // Проверяем баланс
    if (Number(checkingAccount.balance) < totalCost) {
      throw new BadRequestException('Недостаточно средств на счете');
    }

    // Выполняем транзакцию покупки
    const result = await this.prisma.$transaction(async (tx) => {
      // Списываем средства
      const updatedAccount = await tx.account.update({
        where: { id: checkingAccount.id },
        data: {
          balance: {
            decrement: totalCost,
          },
        },
      });

      // Уменьшаем количество товара (если отслеживается)
      if (product.stockQuantity !== -1) {
        await tx.product.update({
          where: { id: productId },
          data: {
            stockQuantity: {
              decrement: quantity,
            },
          },
        });
      }

      // Создаем запись о транзакции
      const transaction = await tx.transaction.create({
        data: {
          fromAccountId: checkingAccount.id,
          amount: totalCost,
          transactionType: TransactionType.PURCHASE,
          description: `Покупка: ${product.name} (${quantity} шт.)`,
          referenceId: productId,
          referenceType: 'PURCHASE',
          status: 'COMPLETED',
          processedAt: new Date(),
          createdBy: userId,
        },
      });

      // Создаем запись о покупке
      const purchase = await tx.purchase.create({
        data: {
          userId,
          productId,
          quantity,
          unitPrice: product.price,
          totalAmount: totalCost,
          transactionId: transaction.id,
          status: PurchaseStatus.COMPLETED,
          purchasedAt: new Date(),
        },
        include: {
          product: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              innl: true,
            },
          },
        },
      });

      return {
        purchase,
        transaction,
        newBalance: Number(updatedAccount.balance),
      };
    });

    return {
      message: 'Покупка успешно совершена',
      purchase: result.purchase,
      newBalance: result.newBalance,
      transactionId: result.transaction.id,
    };
  }

  async getUserPurchases(userId: string): Promise<any[]> {
    return this.prisma.purchase.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductPurchases(productId: string): Promise<any[]> {
    const product = await this.findOne(productId);

    return this.prisma.purchase.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            innl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
