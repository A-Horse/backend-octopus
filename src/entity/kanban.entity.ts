import { ProjectEntity } from './project.entity';
import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne,
    PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

import { ProjectStatus } from '../typing/project.typing';
import { KanbanColumnEntity } from './kanban-column.entity';
import { KanbanSettingEntity } from './kanban-setting.entity';
import { KanbanTrackerEntity } from './kanban-tracker.entity';
import { UserEntity } from './user.entity';

  @Entity({
    name: 'kanban'
  })
  export class KanbanEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;
  
    @OneToOne(() => KanbanSettingEntity, {
      nullable: false
    })
    @JoinColumn({ name: 'settingId' })
    public setting: KanbanSettingEntity;
  
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
    public type: string;
  
    @Column({
      length: 10,
      default: ProjectStatus.ACTIVE
    })
    public status: ProjectStatus;
  
    @ManyToOne(() => UserEntity)
    public creator: UserEntity;

    @ManyToOne(() => ProjectEntity, {
      nullable: false
    })
    public project: ProjectEntity;
  
    @OneToMany(() => KanbanTrackerEntity, tracker => tracker.kanban)
    public trackers: KanbanTrackerEntity[];

    @OneToMany(() => KanbanColumnEntity, column => column.kanban)
    public columns: KanbanColumnEntity[];
  
    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
  }
  