import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne } from 'typeorm';
import { TaskBoard } from './task-board.entity';

@Entity()
export class TaskBoardSetting {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => TaskBoard)
  public taskboard: TaskBoard;

  @Column()
  public showType: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
