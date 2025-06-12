import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  Request,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PurchaseProductDto } from './dto/purchase-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый товар (только для администраторов)' })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async create(@Body() createProductDto: CreateProductDto, @Request() req: any) {
    // TODO: Добавить проверку роли администратора
    const createdBy = req.user?.id || 'cmbtcux840000ryh1ud584lg2'; // Используем существующего пользователя
    return this.productsService.create(createProductDto, createdBy);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех товаров' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, description: 'Включить неактивные товары' })
  @ApiResponse({ status: 200, description: 'Список товаров получен' })
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const includeInactiveBool = includeInactive === 'true';
    return this.productsService.findAll(includeInactiveBool);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiResponse({ status: 200, description: 'Товар найден' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить товар (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар (деактивировать)' })
  @ApiResponse({ status: 200, description: 'Товар успешно деактивирован' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Купить товар' })
  @ApiResponse({ status: 200, description: 'Покупка успешно совершена' })
  @ApiResponse({ status: 400, description: 'Ошибка при покупке' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async purchase(@Body() purchaseDto: PurchaseProductDto, @Request() req: any) {
    // TODO: Получать userId из JWT токена
    const userId = req.user?.id || 'cmbtcux840000ryh1ud584lg2'; // Временно для тестирования
    return this.productsService.purchase(userId, purchaseDto);
  }

  @Get('purchases/my')
  @ApiOperation({ summary: 'Получить мои покупки' })
  @ApiResponse({ status: 200, description: 'Список покупок получен' })
  async getMyPurchases(@Request() req: any) {
    const userId = req.user?.id || 'cmbtcux840000ryh1ud584lg2'; // Временно для тестирования
    return this.productsService.getUserPurchases(userId);
  }

  @Get(':id/purchases')
  @ApiOperation({ summary: 'Получить покупки конкретного товара (для администраторов)' })
  @ApiResponse({ status: 200, description: 'Список покупок товара получен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async getProductPurchases(@Param('id') id: string) {
    return this.productsService.getProductPurchases(id);
  }
}
