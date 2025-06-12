import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PurchaseProductDto {
  @ApiProperty({
    description: 'ID товара для покупки',
    example: 'cmbtcux840000ryh1ud584lg2',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Количество товара для покупки',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    description: 'Комментарий к покупке',
    example: 'Покупка для праздника',
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  comment?: string;
} 