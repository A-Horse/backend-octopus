import { KanbanSetting } from './kanban-setting';
import { KanbanEntity } from './../../entity/kanban.entity';

export class Kanban {
  public id: string;
  public name: string;
  public desc: string;
  public type: string;
  public creatorId: number;
  public createdAt: Date;
  public updatedAt: Date;
  public setting: KanbanSetting;

  constructor({ id, name, desc, type, creatorId, createdAt, updatedAt, setting }) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.creatorId= creatorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.setting = setting;
  }

  static fromDataEntity(dataEntity: KanbanEntity) {
    const setting = KanbanSetting.fromDataEntity(dataEntity.setting);

    return new Kanban({
      id: dataEntity.id,
      name: dataEntity.name,
      desc: dataEntity.desc,
      type: dataEntity.type,
      creatorId: dataEntity.creator.id,
      createdAt: dataEntity.createdAt,
      updatedAt: dataEntity.updatedAt,
      setting: setting
    });
  }
}
