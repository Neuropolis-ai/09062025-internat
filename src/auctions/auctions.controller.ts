import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('auctions')
@Controller('auctions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый аукцион' })
  @ApiResponse({ status: 201, description: 'Аукцион успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(@Body() createAuctionDto: CreateAuctionDto, @Request() req: any) {
    return this.auctionsService.create(createAuctionDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все аукционы' })
  @ApiResponse({ status: 200, description: 'Список аукционов' })
  async findAll() {
    return this.auctionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить аукцион по ID' })
  @ApiResponse({ status: 200, description: 'Данные аукциона' })
  @ApiResponse({ status: 404, description: 'Аукцион не найден' })
  async findOne(@Param('id') id: string) {
    return this.auctionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить аукцион' })
  @ApiResponse({ status: 200, description: 'Аукцион обновлен' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Аукцион не найден' })
  async update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(id, updateAuctionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить аукцион' })
  @ApiResponse({ status: 204, description: 'Аукцион удален' })
  @ApiResponse({ status: 400, description: 'Нельзя удалить активный аукцион' })
  @ApiResponse({ status: 404, description: 'Аукцион не найден' })
  async remove(@Param('id') id: string) {
    return this.auctionsService.remove(id);
  }

  @Post(':id/bids')
  @ApiOperation({ summary: 'Сделать ставку на аукционе' })
  @ApiResponse({ status: 201, description: 'Ставка размещена' })
  @ApiResponse({ status: 400, description: 'Некорректная ставка или недостаточно средств' })
  @ApiResponse({ status: 403, description: 'Нельзя делать ставки на собственный аукцион' })
  @ApiResponse({ status: 404, description: 'Аукцион не найден' })
  async placeBid(
    @Param('id') auctionId: string,
    @Body() placeBidDto: PlaceBidDto,
    @Request() req: any,
  ) {
    return this.auctionsService.placeBid(auctionId, req.user.userId, placeBidDto);
  }

  @Get(':id/bids')
  @ApiOperation({ summary: 'Получить все ставки аукциона' })
  @ApiResponse({ status: 200, description: 'Список ставок' })
  @ApiResponse({ status: 404, description: 'Аукцион не найден' })
  async getAuctionBids(@Param('id') auctionId: string) {
    return this.auctionsService.getAuctionBids(auctionId);
  }

  @Post(':id/close')
  @ApiOperation({ summary: 'Закрыть аукцион' })
  @ApiResponse({ status: 200, description: 'Аукцион закрыт' })
  @ApiResponse({ status: 400, description: 'Аукцион не активен' })
  @ApiResponse({ status: 404, description: 'Аукцион не найден' })
  async closeAuction(@Param('id') auctionId: string) {
    return this.auctionsService.closeAuction(auctionId);
  }
} 