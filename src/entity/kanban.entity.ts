import { KanbanColumnEntity } from './kanban-column.entity';
import { KanbanTrackerEntity } from './kanban-tracker.entity';
import { KanbanSettingEntity } from './kanban-setting.entity';
import { ProjectStatus } from './../typing/project.typing';
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
  
    @OneToMany(() => KanbanTrackerEntity, tracker => tracker.kanban)
    public trackers: KanbanTrackerEntity[];

    @OneToMany(() => KanbanColumnEntity, column => column.kanban)
    public columns: KanbanColumnEntity[];
  
    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
  }
  