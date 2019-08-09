import { KanbanEntity } from './../../entity/kanban.entity';

export class Kanban {
  constructor({ id, name, desc, type, creatorId, createdAt, updatedAt }) {}

  static fromDataEntity(dataEntity: KanbanEntity) {
    return new Kanban({
      id: dataEntity.id,
      name: dataEntity.name,
      desc: dataEntity.desc,
      type: dataEntity.type,
      creatorId: dataEntity.creator.id,
      createdAt: dataEntity.createdAt,
      updatedAt: dataEntity.updatedAt
    });
  }
}
