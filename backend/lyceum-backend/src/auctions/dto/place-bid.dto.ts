import { IsNumber, IsPositive, Min, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaceBidDto {
  @ApiProperty({ description: 'Сумма ставки в L-Coin' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  amount!: number;

  @ApiProperty({ description: 'Комментарий к ставке', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
} 