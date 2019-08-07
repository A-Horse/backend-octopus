import { ProjectStatus, ProjectType } from './../typing/project.typing';
import { ProjectSettingEntity } from './project-setting.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({
  name: 'project'
})
export class Projectntity {
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

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
