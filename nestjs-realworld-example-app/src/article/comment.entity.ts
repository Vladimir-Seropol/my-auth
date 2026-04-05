import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Entity()
export class Comment {

  @PrimaryGeneratedColumn()
  id!: number; // id всегда будет, поэтому обязательный

  @Column()
  body!: string; // делаем обязательным, чтобы соответствовать интерфейсу

  @ManyToOne(() => ArticleEntity, article => article.comments, { onDelete: 'CASCADE' })
  article!: ArticleEntity; // ManyToOne всегда должен ссылаться на сущность

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}