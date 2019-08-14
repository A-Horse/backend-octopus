import { KanbanEntity } from './kanban.entity';
import { ProjectEntity } from './project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';

@Entity({
  name: 'project_default_kanban'
})
export class ProjectSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @OneToOne(() => ProjectEntity)
  @JoinColumn()
  project: ProjectEntity;

  @OneToOne(() => KanbanEntity)
  @JoinColumn()
  public kanban: KanbanEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
