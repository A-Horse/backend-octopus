import { KanbanSettingEntity } from './../../entity/kanban-setting.entity';

export class KanbanSetting {
public id: string;

    constructor({id}) {
        this.id = id;
    }

    static fromDataEntity(dataEntity: KanbanSettingEntity) {
        return new KanbanSetting({
            id: dataEntity.id
        })
    }
}