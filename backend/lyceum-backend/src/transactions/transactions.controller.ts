import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  HttpStatus,
  HttpException 
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return await this.transactionsService.create(createTransactionDto);
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании транзакции: ' + error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    try {
      const filters = {
        userId: userId || undefined,
        type: type || undefined,
        limit: limit ? parseInt(limit) : 50,
        offset: offset ? parseInt(offset) : 0
      };
      return await this.transactionsService.findAll(filters);
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении транзакций: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('stats')
  async getStats() {
    try {
      return await this.transactionsService.getStatistics();
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении статистики: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const transaction = await this.transactionsService.findOne(id);
      if (!transaction) {
        throw new HttpException('Транзакция не найдена', HttpStatus.NOT_FOUND);
      }
      return transaction;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении транзакции: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    try {
      return await this.transactionsService.update(id, updateTransactionDto);
    } catch (error) {
      throw new HttpException(
        'Ошибка при обновлении транзакции: ' + error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.transactionsService.remove(id);
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении транзакции: ' + error.message,
        HttpStatus.BAD_REQUEST
      );
    }
  }
} 