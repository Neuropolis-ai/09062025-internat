import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/auctions',
})
export class AuctionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuctionsGateway.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Извлекаем токен из query параметров или headers
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Проверяем JWT токен
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      // Проверяем пользователя в БД
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        this.logger.warn(`Invalid user for client ${client.id}`);
        client.disconnect();
        return;
      }

      // Сохраняем информацию о пользователе в сокете
      client.userId = user.id;
      client.userRole = user.role;

      this.logger.log(`User ${user.email} connected via WebSocket (${client.id})`);
      
      // Отправляем подтверждение подключения
      client.emit('connected', {
        message: 'Successfully connected to auctions',
        userId: user.id,
      });

    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('joinAuction')
  async handleJoinAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    if (!client.userId) {
      client.emit('error', { message: 'Not authenticated' });
      return;
    }

    try {
      // Проверяем существование аукциона
      const auction = await this.prisma.auction.findUnique({
        where: { id: data.auctionId },
      });

      if (!auction) {
        client.emit('error', { message: 'Auction not found' });
        return;
      }

      // Присоединяем к комнате аукциона
      await client.join(`auction_${data.auctionId}`);
      
      this.logger.log(`User ${client.userId} joined auction ${data.auctionId}`);
      
      client.emit('joinedAuction', {
        auctionId: data.auctionId,
        message: 'Successfully joined auction',
      });

    } catch (error) {
      this.logger.error(`Error joining auction:`, error);
      client.emit('error', { message: 'Failed to join auction' });
    }
  }

  @SubscribeMessage('leaveAuction')
  async handleLeaveAuction(
    @MessageBody() data: { auctionId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    await client.leave(`auction_${data.auctionId}`);
    
    this.logger.log(`User ${client.userId} left auction ${data.auctionId}`);
    
    client.emit('leftAuction', {
      auctionId: data.auctionId,
      message: 'Successfully left auction',
    });
  }

  // Методы для отправки обновлений (вызываются из сервиса)
  async notifyNewBid(auctionId: string, bidData: any) {
    this.server.to(`auction_${auctionId}`).emit('newBid', {
      auctionId,
      bid: bidData,
      timestamp: new Date(),
    });
  }

  async notifyAuctionUpdate(auctionId: string, auctionData: any) {
    this.server.to(`auction_${auctionId}`).emit('auctionUpdate', {
      auctionId,
      auction: auctionData,
      timestamp: new Date(),
    });
  }

  async notifyAuctionClosed(auctionId: string, result: any) {
    this.server.to(`auction_${auctionId}`).emit('auctionClosed', {
      auctionId,
      result,
      timestamp: new Date(),
    });
  }

  async notifyAuctionActivated(auctionId: string, auctionData: any) {
    this.server.to(`auction_${auctionId}`).emit('auctionActivated', {
      auctionId,
      auction: auctionData,
      timestamp: new Date(),
    });
  }
} 