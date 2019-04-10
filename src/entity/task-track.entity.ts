import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskBoardEntity } from './task-board.entity';

export interface ITaskTrack {
  id: string;
  name: string;
  desc: string;
  creator: UserEntity;
  index: number;
  taskboard: TaskBoardEntity;
  type: 'NORMAL';
  status: 'ACTIVE' | 'DONE';
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDelete: boolean;
}

@Entity()
export class TaskTrack implements ITaskTrack {
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
    default: 'ACTIVE'
  })
  public status: 'ACTIVE' | 'DONE';

  @ManyToOne(() => UserEntity)
  public creator: UserEntity;

  public index: number;

  @ManyToOne(() => TaskBoardEntity)
  public taskboard: TaskBoardEntity;

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
