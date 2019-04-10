import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskBoardEntity } from './task-board.entity';
import { TaskTrack } from './task-track.entity';

@Entity()
export class TaskCard {
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
    default: 'NORMAL'
  })
  public type: 'NORMAL' | 'STORY' | 'TODO';

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

  public index: number;

  @ManyToOne(() => TaskTrack)
  public taskTrack: TaskTrack;

  @ManyToOne(() => TaskBoardEntity)
  public taskBoard: TaskBoardEntity;

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
