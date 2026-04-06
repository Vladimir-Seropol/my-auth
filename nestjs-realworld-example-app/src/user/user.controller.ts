// src/user/user.controller.ts
import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { IsEmail, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// --- DTO для регистрации ---
class FlatRegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  username!: string;
}

// --- DTO для логина ---
class FlatLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

// --- Универсальные DTO с поддержкой вложенного user ---
class RegisterDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FlatRegisterDto)
  user?: FlatRegisterDto;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  username?: string;
}

class LoginDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => FlatLoginDto)
  user?: FlatLoginDto;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // --- Регистрация ---
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const data = body.user ?? body;
    const { email, password, username } = data;

    if (!email || !password || !username) {
      throw new BadRequestException('Нужно передать email, password и username');
    }

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new BadRequestException('Пользователь с таким email уже существует');

    const newUser = await this.userService.createUser({ email, password, username });

    // Генерация JWT сразу после регистрации
    const token = await this.userService.login(newUser);

    return {
      user: {
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio ?? null,
        image: newUser.image ?? null,
        token,
      },
    };
  }

  // --- Логин ---
  @Post('login')
  async login(@Body() body: LoginDto) {
    const data = body.user ?? body;
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestException('Нужно передать email и password');
    }

    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new BadRequestException('Неверный email или пароль');
    }

    const token = await this.userService.login(user);

    return {
      user: {
        email: user.email,
        username: user.username,
        token,
      },
    };
  }
}