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
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { SubmitBidDto } from './dto/submit-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый контракт' })
  @ApiResponse({ status: 201, description: 'Контракт успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(@Body() createContractDto: CreateContractDto, @Request() req: any) {
    return this.contractsService.create(createContractDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все контракты (публичный endpoint)' })
  @ApiResponse({ status: 200, description: 'Список контрактов' })
  async findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить контракт по ID (публичный endpoint)' })
  @ApiResponse({ status: 200, description: 'Данные контракта' })
  @ApiResponse({ status: 404, description: 'Контракт не найден' })
  async findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить контракт' })
  @ApiResponse({ status: 200, description: 'Контракт обновлен' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 404, description: 'Контракт не найден' })
  async update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить контракт' })
  @ApiResponse({ status: 204, description: 'Контракт удален' })
  @ApiResponse({ status: 400, description: 'Нельзя удалить контракт в работе' })
  @ApiResponse({ status: 404, description: 'Контракт не найден' })
  async remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }

  @Post(':id/bids')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Подать заявку на контракт' })
  @ApiResponse({ status: 201, description: 'Заявка подана' })
  @ApiResponse({ status: 400, description: 'Некорректная заявка или контракт закрыт' })
  @ApiResponse({ status: 403, description: 'Нельзя подавать заявки на собственный контракт' })
  @ApiResponse({ status: 404, description: 'Контракт не найден' })
  async submitBid(
    @Param('id') contractId: string,
    @Body() submitBidDto: SubmitBidDto,
    @Request() req: any,
  ) {
    return this.contractsService.submitBid(contractId, req.user.userId, submitBidDto);
  }

  @Get(':id/bids')
  @ApiOperation({ summary: 'Получить все заявки контракта (публичный endpoint)' })
  @ApiResponse({ status: 200, description: 'Список заявок' })
  @ApiResponse({ status: 404, description: 'Контракт не найден' })
  async getContractBids(@Param('id') contractId: string) {
    return this.contractsService.getContractBids(contractId);
  }

  @Post(':id/bids/:bidId/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Принять заявку на контракт' })
  @ApiResponse({ status: 200, description: 'Заявка принята' })
  @ApiResponse({ status: 400, description: 'Заявка уже обработана или контракт не открыт' })
  @ApiResponse({ status: 404, description: 'Контракт или заявка не найдены' })
  async acceptBid(@Param('id') contractId: string, @Param('bidId') bidId: string) {
    return this.contractsService.acceptBid(contractId, bidId);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Завершить контракт' })
  @ApiResponse({ status: 200, description: 'Контракт завершен' })
  @ApiResponse({ status: 400, description: 'Контракт не в работе' })
  @ApiResponse({ status: 404, description: 'Контракт не найден' })
  async completeContract(@Param('id') contractId: string) {
    return this.contractsService.completeContract(contractId);
  }
}
