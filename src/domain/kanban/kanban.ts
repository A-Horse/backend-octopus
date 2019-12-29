import { KanbanEntity } from '../../orm/kanban.entity';
import { JSONEntity } from '../../shared/interface/json';
import { KanbanSetting } from './kanban-setting';

export class Kanban implements JSONEntity {
  public id: string;
  public name: string;
  public desc: string;
  public type: string;
  public creatorId: number;
  public projectId: string;
  public createdAt: Date;
  public updatedAt: Date;
  public setting: KanbanSetting;

  constructor({
    id,
    name,
    desc,
    type,
    creatorId,
    createdAt,
    updatedAt,
    setting,
    projectId
  }) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.creatorId = creatorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.setting = setting;
    this.projectId = projectId;
  }

  static fromDataEntity(dataEntity: KanbanEntity) {
    const setting = KanbanSetting.fromDataEntity(dataEntity.setting);

    return new Kanban({
      id: dataEntity.id,
      name: dataEntity.name,
      desc: dataEntity.desc,
      type: dataEntity.type,
      projectId: dataEntity.project.id,
      creatorId: dataEntity.creator.id,
      createdAt: dataEntity.createdAt,
      updatedAt: dataEntity.updatedAt,
      setting: setting
    });
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      projectId: this.projectId,
      creatorId: this.creatorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      setting: this.setting.toJSON()
    };
  }
}
