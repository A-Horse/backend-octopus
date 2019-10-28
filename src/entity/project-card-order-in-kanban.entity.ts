import { KanbanEntity } from './kanban.entity';
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { ProjectIssueEntity } from './project-issue.entity';

@Entity({
  name: 'project_issue_order_in_kanban'
})
export class ProjectIssueOrderInKanbanEntity {
  @ManyToOne(type => KanbanEntity, {
    nullable: false,
    primary: true
  })
  public kanban: KanbanEntity;

  @ManyToOne(type => ProjectIssueEntity, {
    nullable: false,
    primary: true
  })
  public issue: ProjectIssueEntity;

  @Column({type: 'float'})
  public order: number;
}
