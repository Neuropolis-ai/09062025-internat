import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Notification, UserNotification, Prisma } from '@prisma/client';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const { userIds, ...notificationData } = createNotificationDto;

    // Создаем уведомление
    const notification = await this.prisma.notification.create({
      data: notificationData,
    });

    // Если это глобальное уведомление, отправляем всем пользователям
    if (createNotificationDto.isGlobal) {
      const allUsers = await this.prisma.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      const userNotifications = allUsers.map(user => ({
        userId: user.id,
        notificationId: notification.id,
      }));

      await this.prisma.userNotification.createMany({
        data: userNotifications,
      });
    } else if (userIds && userIds.length > 0) {
      // Отправляем конкретным пользователям
      const userNotifications = userIds.map(userId => ({
        userId,
        notificationId: notification.id,
      }));

      await this.prisma.userNotification.createMany({
        data: userNotifications,
      });
    }

    return notification;
  }

  async findAll(): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      include: {
        userNotifications: {
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
        _count: {
          select: {
            userNotifications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: {
        userNotifications: {
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
        _count: {
          select: {
            userNotifications: true,
          },
        },
      },
    });

    if (!notification) {
      throw new NotFoundException(`Уведомление с ID ${id} не найдено`);
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const existingNotification = await this.findOne(id);

    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
      include: {
        userNotifications: {
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
        _count: {
          select: {
            userNotifications: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    const existingNotification = await this.findOne(id);

    await this.prisma.notification.delete({
      where: { id },
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<UserNotification> {
    const userNotification = await this.prisma.userNotification.findUnique({
      where: {
        userId_notificationId: {
          userId,
          notificationId,
        },
      },
    });

    if (!userNotification) {
      throw new NotFoundException('Уведомление для пользователя не найдено');
    }

    return this.prisma.userNotification.update({
      where: {
        userId_notificationId: {
          userId,
          notificationId,
        },
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUserNotifications(userId: string): Promise<UserNotification[]> {
    return this.prisma.userNotification.findMany({
      where: { userId },
      include: {
        notification: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getNotificationStats(id: string) {
    const notification = await this.findOne(id);
    
    const totalRecipients = await this.prisma.userNotification.count({
      where: { notificationId: id },
    });

    const readCount = await this.prisma.userNotification.count({
      where: { 
        notificationId: id,
        isRead: true,
      },
    });

    return {
      id,
      title: notification.title,
      totalRecipients,
      readCount,
      readPercentage: totalRecipients > 0 ? Math.round((readCount / totalRecipients) * 100) : 0,
    };
  }
} 