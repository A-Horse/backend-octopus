import { KanbanSettingEntity } from '../../orm/kanban-setting.entity';

export class KanbanSetting {
  public id: string;

  constructor({ id }) {
    this.id = id;
  }

  static fromDataEntity(dataEntity: KanbanSettingEntity) {
    return new KanbanSetting({
      id: dataEntity.id
    });
  }

  public toJSON() {
    return {
      id: this.id
    };
  }
}
