import { KanbanEntity } from './kanban.entity';
import { ProjectEntity } from './project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { KanbanCardType } from '../typing/kanban-card.typing';
import { KanbanColumnEntity } from './kanban-column.entity';
import { KanbanEpicEntity } from './kanban-epic.entity';
import { UserEntity } from './user.entity';
import { ProjectCardOrderInKanbanEntity } from './project-card-order-in-kanban.entity';

@Entity({
  name: 'project_card'
})
export class ProjectCardEntity {
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
    default: KanbanCardType.NORMAL
  })
  public type: KanbanCardType;

  @ManyToOne(() => UserEntity)
  public creator: UserEntity;

  @ManyToOne(() => UserEntity)
  public assignee: UserEntity;

  @ManyToOne(() => KanbanColumnEntity, column => column.cards, {
    nullable: true
  })
  public column: KanbanColumnEntity;

  @ManyToOne(type => KanbanEpicEntity, epic => epic.cards, {
    nullable: true
  })
  public epic: KanbanEpicEntity;

  @ManyToOne(type => ProjectEntity, project => project.cards)
  public project: ProjectEntity;

  @ManyToOne(type => KanbanEntity, kanban => kanban.cards, {
    nullable: true
  })
  public kanban: KanbanEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public orderInKanban: ProjectCardOrderInKanbanEntity;
}
