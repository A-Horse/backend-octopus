import { KanbanCardRepository } from './kanban-card-repository';
import { KanbanCardType } from './../../typing/kanban-card.typing';
import { KanbanCardEntity } from './../../entity/kanban-card.entity';
import { JSONEntity } from './../interface/json';

export class KanbanCard implements JSONEntity {
  public id: string;
  public title: string;
  public content: string;
  public type: KanbanCardType;
  public creatorId: number;
  public assigneeId: number;
  public columnId: string;
  public order: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    title,
    content,
    type,
    creatorId,
    assigneeId,
    columnId,
    order,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.type = type;
    this.creatorId = creatorId;
    this.assigneeId = assigneeId;
    this.columnId = columnId;
    this.order = order;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDataEntity(dataEntity: KanbanCardEntity): KanbanCard {
    return new KanbanCard({
      id: dataEntity.id,
      title: dataEntity.title,
      content: dataEntity.content,
      type: dataEntity.type,
      creatorId: dataEntity.creator.id,
      assigneeId: dataEntity.assignee.id,
      columnId: dataEntity.column.id,
      order: dataEntity.order,
      createdAt: dataEntity.createdAt,
      updatedAt: dataEntity.updatedAt
    });
  }

  
  public async initOrder(): Promise<void> {
    this.order = (await KanbanCardRepository.getColumnCardCount(this.columnId)) * 100;
  }


  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      type: this.type,
      creatorId: this.creatorId,
      columnId: this.columnId,
      order: this.order,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

}
