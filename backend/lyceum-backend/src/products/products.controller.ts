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
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PurchaseProductDto } from './dto/purchase-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiResponse({ status: 201, description: 'Товар успешно создан' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: User) {
    return this.productsService.create(createProductDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список товаров' })
  @ApiResponse({ status: 200, description: 'Список товаров получен' })
  @ApiQuery({ name: 'includeInactive', required: false, description: 'Включить неактивные товары' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить товар' })
  @ApiResponse({ status: 200, description: 'Товар успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiResponse({ status: 200, description: 'Товар успешно удален' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('purchase')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Купить товар' })
  @ApiResponse({ status: 200, description: 'Покупка успешно совершена' })
  @ApiResponse({ status: 400, description: 'Ошибка при покупке' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async purchase(@Body() purchaseDto: PurchaseProductDto, @CurrentUser() user: User) {
    return this.productsService.purchase(user.id, purchaseDto);
  }

  @Get('purchases/my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить мои покупки' })
  @ApiResponse({ status: 200, description: 'Список покупок получен' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getMyPurchases(@CurrentUser() user: User) {
    return this.productsService.getUserPurchases(user.id);
  }

  @Get(':id/purchases')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить покупки конкретного товара (для администраторов)' })
  @ApiResponse({ status: 200, description: 'Список покупок товара получен' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getProductPurchases(@Param('id') id: string) {
    return this.productsService.getProductPurchases(id);
  }
}
