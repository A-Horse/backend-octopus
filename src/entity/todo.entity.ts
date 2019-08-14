import {
    Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { UserEntity } from './user.entity';

export interface ITodo {
  id: string;
  content: string;
  desc: string;
  type: 'NORMAL';
  status: 'ACTIVE' | 'DONE';
  createdAt: Date;
  updatedAt: Date;
}

@Entity()
export class Todo implements ITodo {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    length: 150
  })
  public content: string;

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

  @Column({ type: 'datetime', nullable: true })
  public deadline?: Date;

  @ManyToOne(() => UserEntity)
  public creator: UserEntity;

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
