import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { ArticleModule } from './article/article.module';
import { AppController } from './app.controller'; // <-- подключаем контроллер
import { ArticleEntity } from './article/article.entity';
import { UserEntity } from './user/user.entity';
import { Comment } from './article/comment.entity';
import { FollowsEntity } from './profile/follows.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [UserEntity, ArticleEntity, Comment, FollowsEntity],
      synchronize: true,
    }),
    UserModule,
    ProfileModule,
    ArticleModule,
  ],
  controllers: [AppController], // <-- здесь
})
export class ApplicationModule {}