import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { KanbanTrackerStatus } from '../typing/kanban-tracker.typing';
import { KanbanCardEntity } from './kanban-card.entity';
import { KanbanEntity } from './kanban.entity';
import { UserEntity } from './user.entity';

  @Entity({
    name: 'kanban_tracker'
  })
  export class KanbanTrackerEntity {
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

    @ManyToOne(() => KanbanEntity, kanban => kanban.trackers)
    public kanban: KanbanEntity;
  
    @OneToMany(() => KanbanCardEntity, card => card.track)
    public cards: KanbanCardEntity[];
  
    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
  }
  