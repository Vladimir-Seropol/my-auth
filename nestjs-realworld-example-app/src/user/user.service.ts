// src/user/user.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

export interface AuthUserPayload {
    id: number;
    email: string;
    username: string;
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) { }

    // Найти пользователя по ID
    async findById(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException(`Пользователь с id ${id} не найден`);
        return user;
    }

    // Найти пользователя по email
    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.usersRepository.findOne({ where: { email } });
        return user ?? null;
    }

    // Создание пользователя с хэшированием пароля
   // src/user/user.service.ts
async createUser(data: { email: string; password: string; username: string }): Promise<UserEntity> {
    const existing = await this.usersRepository.findOne({ where: { email: data.email } });
    if (existing) throw new BadRequestException(`Пользователь с email ${data.email} уже существует`);

    const user = this.usersRepository.create(data); // пароль хэшируется через @BeforeInsert
    return this.usersRepository.save(user);
}

async validateUser(email: string, password: string): Promise<AuthUserPayload | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) return null;

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) return null;

    return { id: user.id, email: user.email, username: user.username };
}

    // Генерация JWT токена
    async login(user: AuthUserPayload): Promise<{ access_token: string }> {
        const payload = { sub: user.id, email: user.email };
        const secret = process.env.JWT_SECRET || 'supersecretkey';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        return { access_token: token };
    }

    // Удаление пользователя
    async deleteUser(id: number): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Пользователь с id ${id} не найден`);
    }
}