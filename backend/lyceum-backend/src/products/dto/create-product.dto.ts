import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Название товара',
    example: 'Шоколадка Mars',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Описание товара',
    example: 'Вкусная шоколадка с карамелью и нугой',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Стоимость товара в L-Coin',
    example: 25,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'URL изображения товара',
    example: 'https://example.com/mars.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Количество товара в наличии',
    example: 50,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Активен ли товар для продажи',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
} 