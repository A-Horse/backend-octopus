import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskTrackEntity } from './task-track.entity';
import { TaskCardType } from '../typing/task-card.typing';

@Entity({
  name: 'task_card'
})
export class TaskCardEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 150
  })
  public title: string;

  @Column({
    nullable: true
  })
  public content: string;

  @Column({
    length: 10,
    default: TaskCardType.NORMAL
  })
  public type: TaskCardType;

  @Column({
    length: 10,
    default: 'ACTIVE'
  })
  public status: 'ACTIVE' | 'DONE';

  @ManyToOne(() => UserEntity)
  public creator: UserEntity;

  @ManyToOne(() => UserEntity)
  public owner: UserEntity;

  @ManyToOne(() => UserEntity)
  public assignee: UserEntity;

  @ManyToOne(type => TaskTrackEntity, track => track.cards)
  public track: TaskTrackEntity;

  @Column({
    nullable: false,
    type: 'double'
  })
  public order: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({
    nullable: true
  })
  public deletedAt?: Date;

  @Column({
    default: false
  })
  public isDelete: boolean;
}
