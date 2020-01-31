import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ProjectStatus } from '../typing/project.typing';
import { KanbanColumnEntity } from './kanban-column.entity';
import { KanbanEpicEntity } from './kanban-epic.entity';
import { KanbanSettingEntity } from './kanban-setting.entity';
import { ProjectIssueEntity } from './project-issue.entity';
import { ProjectEntity } from './project.entity';
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

  @OneToMany(
    () => KanbanEpicEntity,
    epic => epic.kanban
  )
  public epics: KanbanEpicEntity[];

  @OneToMany(
    () => KanbanColumnEntity,
    column => column.kanban
  )
  public columns: KanbanColumnEntity[];

  @OneToMany(
    () => ProjectIssueEntity,
    card => card.kanban
  )
  public cards: ProjectIssueEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
