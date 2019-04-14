import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne
} from 'typeorm';
import { TaskBoardShowType } from '../typing/task-board.typing';

@Entity({
  name: 'task_board_setting'
})
export class TaskBoardSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    default: TaskBoardShowType.COLUMN
  })
  public showType: TaskBoardShowType;

  @Column({
    nullable: true
  })
  public cover: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
