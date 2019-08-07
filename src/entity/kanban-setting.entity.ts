import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity({
    name: 'kanban_setting'
  })
  export class KanbanSettingEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;
  
    @CreateDateColumn()
    public createdAt: Date;
  
    @UpdateDateColumn()
    public updatedAt: Date;
  }
  