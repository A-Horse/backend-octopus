import {
    Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { KanbanColumnStatus } from '../typing/kanban-column.typing';
import { ProjectCardEntity } from './project-card.entity';
import { KanbanEntity } from './kanban.entity';
import { UserEntity } from './user.entity';

  @Entity({
    name: 'kanban_column'
  })
  export class KanbanColumnEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;
  
    @Column({
      length: 150
    })
    public name: string;
  
    @Column({
      length: 10,
      default: KanbanColumnStatus.ACTIVE
    })
    public status: KanbanColumnStatus;
  
    @ManyToOne(() => UserEntity)
    public creator: UserEntity;
  
    @Column({
      type: 'double',
      nullable: false
    })
    public order: number;
  
    @ManyToOne(() => KanbanEntity, board => board.columns)
    public kanban: KanbanEntity;
     
    @OneToMany(() => ProjectCardEntity, card => card.column)
    public cards: ProjectCardEntity[];
  
    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
  }
  