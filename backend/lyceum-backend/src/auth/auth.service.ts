import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  innl: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const saltRounds = this.configService.get<number>('security.bcryptRounds') || 12;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Генерируем ИННЛ
    const innl = await this.usersService.generateInnl();

    // Создаем пользователя напрямую через Prisma
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        passwordHash: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        classId: registerDto.classId,
        cottageId: registerDto.cottageId,
        phone: registerDto.phone,
        role: registerDto.role || UserRole.STUDENT,
        innl,
      },
    });

    // Генерируем токены
    const tokens = await this.generateTokens(user);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // Находим пользователя по email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Проверяем, активен ли пользователь
    if (!user.isActive) {
      throw new UnauthorizedException('Аккаунт заблокирован');
    }

    // Генерируем токены
    const tokens = await this.generateTokens(user);

    // Обновляем время последнего входа
    await this.usersService.update(user.id, {
      lastLoginAt: new Date(),
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    const user = await this.usersService.findOne(payload.sub);
    if (user && user.isActive) {
      return user;
    }
    return null;
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      innl: user.innl,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async createUserAccounts(userId: string): Promise<void> {
    // Создаем расчетный счет
    await this.prisma.account.create({
      data: {
        userId,
        accountNumber: await this.generateAccountNumber(),
        accountType: 'CHECKING',
        balance: 0,
      },
    });

    // Создаем кредитный счет
    await this.prisma.account.create({
      data: {
        userId,
        accountNumber: await this.generateAccountNumber(),
        accountType: 'CREDIT',
        balance: 0,
        creditLimit: 1000, // Базовый кредитный лимит
      },
    });
  }

  private async generateAccountNumber(): Promise<string> {
    let accountNumber = '';
    let exists = true;

    while (exists) {
      // Генерируем номер счета в формате: 40817810XXXXXXXXXX (20 цифр)
      accountNumber = '40817810' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
      
      const existingAccount = await this.prisma.account.findUnique({
        where: { accountNumber },
      });
      exists = !!existingAccount;
    }

    return accountNumber;
  }
}
