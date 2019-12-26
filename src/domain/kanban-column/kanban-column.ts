import { KanbanColumnEntity } from '../../orm/kanban-column.entity';
import { KanbanColumnStatus } from '../../typing/kanban-column.typing';
import { JSONEntity } from '../../shared/interface/json';
import { KanbanColumnRepository } from './kanban-column-repository';

export class KanbanColumn implements JSONEntity {
  public id: string;
  public name: string;
  public status: KanbanColumnStatus;
  public creatorId: number;
  public order: number;
  public createdAt: Date;
  public udpatedAt: Date;
  public kanbanId: string;

  constructor({ id, name, status, creatorId, order, createdAt, updatedAt, kanbanId }) {
    this.id = id;
    this.name = name;
    this.status = status || KanbanColumnStatus.ACTIVE;
    this.creatorId = creatorId;
    this.order = order;
    this.createdAt = createdAt;
    this.udpatedAt = updatedAt;
    this.kanbanId = kanbanId;
  }

  static fromDataEntity(dataEntity: KanbanColumnEntity): KanbanColumn {
    return new KanbanColumn({
      id: dataEntity.id,
      name: dataEntity.name,
      status: dataEntity.status,
      creatorId: dataEntity.creator.id,
      order: dataEntity.order,
      createdAt: dataEntity.createdAt,
      updatedAt: dataEntity.updatedAt,
      kanbanId: dataEntity.kanban.id
    });
  }


  public async initOrder(): Promise<void> {
    this.order = (await KanbanColumnRepository.getKanbanColumnCount(this.kanbanId)) * 100;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      creatorId: this.creatorId,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.udpatedAt,
      kanbanId: this.kanbanId
    };
  }
}
