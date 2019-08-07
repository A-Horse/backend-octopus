import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
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
  
    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
  }
  