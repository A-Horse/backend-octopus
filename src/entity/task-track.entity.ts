import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { TaskTrackStatus } from '../typing/task-track.typing';
import { TaskBoardEntity } from './task-board.entity';
import { TaskCardEntity } from './task-card.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'task_track'
})
export class TaskTrackEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 150
  })
  public name: string;

  @Column({
    nullable: true
  })
  public desc: string;

  @Column({
    length: 10,
    default: 'NORMAL'
  })
  public type: 'NORMAL';

  @Column({
    length: 10,
    default: TaskTrackStatus.ACTIVE
  })
  public status: TaskTrackStatus;

  @ManyToOne(() => UserEntity)
  public creator: UserEntity;

  @Column({
    type: 'double',
    nullable: false
  })
  public order: number;

  @ManyToOne(type => TaskBoardEntity, board => board.tracks)
  board: TaskBoardEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => TaskCardEntity, card => card.track)
  public cards: TaskCardEntity[];

  @Column({
    nullable: true
  })
  public deletedAt?: Date;

  @Column({
    default: false
  })
  public isDelete: boolean;
}
