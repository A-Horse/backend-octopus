import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { TaskBoardEntity } from './task-board.entity';
import { TaskBoardShowType } from '../typing/task-board.typing';

@Entity()
export class TaskBoardSetting {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    default: TaskBoardShowType.COLUMN
  })
  public showType: TaskBoardShowType;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
