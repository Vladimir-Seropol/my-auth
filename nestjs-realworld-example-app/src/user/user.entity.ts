import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import * as argon2 from 'argon2';
import { ArticleEntity } from '../article/article.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: '' })
  bio!: string;

  @Column({ default: '' })
  image!: string;

  @Column({ default: '' })
  username!: string;

  @OneToMany(() => ArticleEntity, article => article.author)
  articles?: ArticleEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites?: ArticleEntity[];

  // ⚠️ user: any; — удаляем, это не нужно здесь

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}