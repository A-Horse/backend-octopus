import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { ProjectStatus, ProjectType } from '../typing/project.typing';
import { ProjectIssueEntity } from './project-issue.entity';
import { ProjectSettingEntity } from './project-setting.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'project'
})
export class ProjectEntity {
  @PrimaryColumn()
  public id: string;

  @OneToOne(type => ProjectSettingEntity, {
    nullable: false
  })
  @JoinColumn({ name: 'settingId' })
  public setting: ProjectSettingEntity;

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
    default: ProjectType.NORMAL
  })
  public type: ProjectType;

  @Column({
    length: 10,
    default: ProjectStatus.ACTIVE
  })
  public status: ProjectStatus;

  @ManyToOne(() => UserEntity)
  public creator: UserEntity;

  @ManyToOne(() => UserEntity)
  public owner: UserEntity;

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
