import { IsEmail, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Email пользователя', example: 'student@lyceum.edu' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Пароль', example: 'securePassword123' })
  @IsString()
  passwordHash: string;

  @ApiProperty({ description: 'Имя', example: 'Иван' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Фамилия', example: 'Иванов' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Отчество', example: 'Иванович' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiPropertyOptional({ description: 'ID класса' })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiPropertyOptional({ description: 'ID коттеджа' })
  @IsOptional()
  @IsString()
  cottageId?: string;

  @ApiPropertyOptional({ description: 'URL аватара' })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: 'Номер телефона' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Дата рождения' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ 
    description: 'Роль пользователя', 
    enum: UserRole,
    default: UserRole.STUDENT 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 