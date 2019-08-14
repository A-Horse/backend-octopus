import {
    Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
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

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
