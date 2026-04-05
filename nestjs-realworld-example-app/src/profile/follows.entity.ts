import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity('follows')
export class FollowsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  followerId!: number;

  @Column()
  followingId!: number;

  // Рекомендуется добавить связи ManyToOne для удобного запроса через relations
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'followerId' })
  follower!: UserEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: 'followingId' })
  following!: UserEntity;
}