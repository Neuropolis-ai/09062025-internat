import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ 
    description: 'Email пользователя', 
    example: 'student@lyceum.edu' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Пароль пользователя', 
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Имя', example: 'Иван' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Фамилия', example: 'Иванов' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'ID класса' })
  @IsOptional()
  @IsString()
  classId?: string;

  @ApiPropertyOptional({ description: 'ID коттеджа' })
  @IsOptional()
  @IsString()
  cottageId?: string;

  @ApiPropertyOptional({ description: 'Номер телефона' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Роль пользователя', 
    enum: UserRole,
    default: UserRole.STUDENT 
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 