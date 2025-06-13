import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFaqDto: CreateFaqDto) {
    return this.prisma.fAQ.create({
      data: {
        question: createFaqDto.question,
        answer: createFaqDto.answer,
        category: createFaqDto.category,
        sortOrder: createFaqDto.sortOrder || 0,
        isActive: createFaqDto.isActive ?? true,
      },
    });
  }

  async findAll(category?: string, search?: string, isActive?: boolean) {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.fAQ.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    return this.prisma.fAQ.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateFaqDto: UpdateFaqDto) {
    return this.prisma.fAQ.update({
      where: { id },
      data: updateFaqDto,
    });
  }

  async remove(id: string) {
    return this.prisma.fAQ.delete({
      where: { id },
    });
  }

  async getCategories() {
    const result = await this.prisma.fAQ.groupBy({
      by: ['category'],
      where: {
        category: { not: null },
        isActive: true,
      },
      _count: {
        id: true,
      },
    });

    return result.map(item => ({
      name: item.category,
      count: item._count.id,
    }));
  }

  async getFaqStats() {
    const [total, active, categories] = await Promise.all([
      this.prisma.fAQ.count(),
      this.prisma.fAQ.count({ where: { isActive: true } }),
      this.prisma.fAQ.groupBy({
        by: ['category'],
        where: {
          category: { not: null },
          isActive: true,
        },
        _count: { id: true },
      }),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      categories: categories.length,
    };
  }
} 