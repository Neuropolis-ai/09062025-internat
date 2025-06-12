import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuctionDto {
  @ApiProperty({ description: 'Название лота' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Описание лота' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'URL изображения лота', required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Начальная цена в L-Coin' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  startingPrice!: number;

  @ApiProperty({ description: 'Минимальный шаг ставки в L-Coin', default: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  minBidIncrement?: number;

  @ApiProperty({ description: 'Время начала аукциона (ISO string)' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ description: 'Время окончания аукциона (ISO string)' })
  @IsDateString()
  endTime!: string;
} 