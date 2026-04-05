import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from './follows.entity';
import { ProfileRO, ProfileData } from './profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}

  // Получить всех пользователей
  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  // Получить профиль по опциональным параметрам
  async findOne(options?: Partial<UserEntity>): Promise<ProfileRO> {
    const user = await this.userRepository.findOne({ where: options });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const profile: ProfileData = {
      username: user.username,
      bio: user.bio || '',
      image: user.image || '',
      following: false,
    };

    return { profile };
  }

  // Найти профиль с информацией о подписке
  async findProfile(id: number, followingUsername: string): Promise<ProfileRO> {
    const user = await this.userRepository.findOne({ where: { username: followingUsername } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const follows = await this.followsRepository.findOne({
      where: { followerId: id, followingId: user.id },
    });

    const profile: ProfileData = {
      username: user.username,
      bio: user.bio || '',
      image: user.image || '',
      following: !!follows,
    };

    return { profile };
  }

  // Подписаться на пользователя
  async follow(followerEmail: string, username: string): Promise<ProfileRO> {
    if (!followerEmail || !username) {
      throw new HttpException('Follower email and username not provided', HttpStatus.BAD_REQUEST);
    }

    const followingUser = await this.userRepository.findOne({ where: { username } });
    const followerUser = await this.userRepository.findOne({ where: { email: followerEmail } });

    if (!followingUser || !followerUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (followingUser.email === followerEmail) {
      throw new HttpException('Follower cannot follow self', HttpStatus.BAD_REQUEST);
    }

    const exists = await this.followsRepository.findOne({
      where: { followerId: followerUser.id, followingId: followingUser.id },
    });

    if (!exists) {
      const follows = this.followsRepository.create({
        followerId: followerUser.id,
        followingId: followingUser.id,
      });
      await this.followsRepository.save(follows);
    }

    const profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio || '',
      image: followingUser.image || '',
      following: true,
    };

    return { profile };
  }

  // Отписаться от пользователя
  async unFollow(followerId: number, username: string): Promise<ProfileRO> {
    if (!followerId || !username) {
      throw new HttpException('FollowerId and username not provided', HttpStatus.BAD_REQUEST);
    }

    const followingUser = await this.userRepository.findOne({ where: { username } });
    if (!followingUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (followingUser.id === followerId) {
      throw new HttpException('Follower cannot unfollow self', HttpStatus.BAD_REQUEST);
    }

    await this.followsRepository.delete({ followerId, followingId: followingUser.id });

    const profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio || '',
      image: followingUser.image || '',
      following: false,
    };

    return { profile };
  }
}