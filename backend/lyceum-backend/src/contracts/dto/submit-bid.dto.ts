import { IsNumber, IsPositive, Min, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitBidDto {
  @ApiProperty({ description: 'Предлагаемая цена в L-Coin' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  bidAmount!: number;

  @ApiProperty({ description: 'Комментарий к заявке', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
} 