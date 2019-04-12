import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskBoardStatus } from '../typing/task-board.typing';
import { TaskBoardSettingEntity } from './task-boad-setting.entity';
import { TaskTrackEntity } from './task-track.entity';

@Entity({
  name: 'task_board'
})
export class TaskBoardEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(type => TaskBoardSettingEntity, {
    nullable: false
  })
  @JoinColumn({ name: 'settingId' })
  setting: TaskBoardSettingEntity;

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
    default: TaskBoardStatus.ACTIVE
  })
  public status: TaskBoardStatus;

  @ManyToOne(() => UserEntity)
  public creator: UserEntity;

  @ManyToOne(() => UserEntity)
  public owner: UserEntity;

  @OneToMany(() => TaskTrackEntity, track => track.board)
  public tracks: TaskTrackEntity;

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
