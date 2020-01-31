import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { KanbanEntity } from './kanban.entity';

@Entity({
  name: 'project_setting'
})
export class ProjectSettingEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    nullable: true,
    type: 'char',
    length: 40
  })
  public coverFileName: string;

  @Column({
    default: false
  })
  public isStar: boolean;

  @ManyToOne(() => KanbanEntity, {
    nullable: true,
    eager: true
  })
  @JoinColumn({ name: 'defaultKanbanId' })
  public defaultKanban: KanbanEntity;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
