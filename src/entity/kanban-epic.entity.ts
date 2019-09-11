import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { KanbanTrackerStatus } from '../typing/kanban-tracker.typing';
import { ProjectCardEntity } from './project-card.entity';
import { KanbanEntity } from './kanban.entity';
import { UserEntity } from './user.entity';

  @Entity({
    name: 'kanban_epic'
  })
  export class KanbanEpicEntity {
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
      default: KanbanTrackerStatus.ACTIVE
    })
    public status: KanbanTrackerStatus;
  
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'creatorId' })
    public creator: UserEntity;

    @ManyToOne(() => KanbanEntity, kanban => kanban.epics)
    public kanban: KanbanEntity;
  
    @OneToMany(() => ProjectCardEntity, card => card.epic)
    public cards: ProjectCardEntity[];
  
    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
  }
  