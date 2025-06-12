import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsDateString, Min, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({ description: 'Название контракта' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Описание контракта' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ description: 'Вознаграждение в L-Coin' })
  @IsNumber()
  @IsPositive()
  @Min(1)
  rewardAmount!: number;

  @ApiProperty({ description: 'Требования к исполнителю', required: false })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ description: 'Категория контракта', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Крайний срок выполнения (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({ description: 'Максимальное количество участников', default: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  maxParticipants?: number;
} 