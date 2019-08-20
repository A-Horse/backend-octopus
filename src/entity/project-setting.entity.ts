import { KanbanEntity } from './kanban.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

@Entity({
  name: 'project_setting'
})
export class ProjectSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: true
  })
  public cover: string;

  @Column({
    default: false
  })
  public isStar: boolean;

  @ManyToOne(() => KanbanEntity, {
    nullable: true,
    eager: true
  })
  @JoinColumn({ name: "defaultKanbanId" })
  public defaultKanban: KanbanEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
