import { KanbanEntity } from './kanban.entity';
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { ProjectCardEntity } from './project-card.entity';

@Entity({
  name: 'project_card_order_in_kanban'
})
export class ProjectCardOrderInKanbanEntity {
  @ManyToOne(type => KanbanEntity, {
    nullable: false,
    primary: true
  })
  public kanban: KanbanEntity;

  @ManyToOne(type => ProjectCardEntity, {
    nullable: false,
    primary: true
  })
  public card: ProjectCardEntity;

  @Column()
  public order: number;
}
