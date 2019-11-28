import {
    Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn
} from 'typeorm';

import { ProjectIssueType } from '../typing/kanban-card.typing';
import { KanbanColumnEntity } from './kanban-column.entity';
import { KanbanEpicEntity } from './kanban-epic.entity';
import { KanbanEntity } from './kanban.entity';
import { ProjectIssueOrderInKanbanEntity } from './project-card-order-in-kanban.entity';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'project_issue'
})
export class ProjectIssueEntity {
  @PrimaryColumn()
  public id: string;

  @Column({
    length: 150
  })
  public title: string;

  @Column({
    length: 10,
    default: ProjectIssueType.NORMAL
  })
  public type: ProjectIssueType;

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

  public orderInKanban: ProjectIssueOrderInKanbanEntity;
}
