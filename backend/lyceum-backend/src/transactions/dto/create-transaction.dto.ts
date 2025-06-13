import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  TRANSFER = 'TRANSFER',
  PURCHASE = 'PURCHASE',
  REWARD = 'REWARD'
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  referenceId?: string; // ID связанной записи (покупка, аукцион и т.д.)

  @IsOptional()
  @IsString()
  referenceType?: string; // Тип операции (shop, auction, contract, manual)
} 