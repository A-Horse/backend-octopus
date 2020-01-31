import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { KanbanEntity } from './kanban.entity';
import { ProjectEntity } from './project.entity';

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
