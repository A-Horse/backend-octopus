import { ProjectCardEntity } from './project-card.entity';
import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';

import { ProjectStatus, ProjectType } from '../typing/project.typing';
import { ProjectSettingEntity } from './project-setting.entity';
import { UserEntity } from './user.entity';

@Entity({
  name: 'project'
})
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
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

  @OneToMany(() => ProjectCardEntity, card => card.kanban)
  public cards: ProjectCardEntity[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
