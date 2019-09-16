import { ProjectCardRepository } from './kanban-card-repository';
import { ProjectCardType } from '../../typing/kanban-card.typing';
import { ProjectCardEntity } from '../../entity/project-card.entity';
import { JSONEntity } from '../interface/json';
import * as _ from 'lodash';

export class ProjectCard implements JSONEntity {
  public id: string;
  public title: string;
  public content: string;
  public type: ProjectCardType;
  public creatorId: number;
  public assigneeId: number;
  public columnId: string;
  public kanbanId: string;
  public projectId: string;
  public orderInKanban: number;
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
    kanbanId,
    orderInKanban,
    projectId,
    createdAt,
    updatedAt
  }: any) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.type = type || ProjectCardType.NORMAL;
    this.creatorId = creatorId;
    this.assigneeId = assigneeId;
    this.columnId = columnId;
    this.kanbanId = kanbanId;
    this.orderInKanban = orderInKanban;
    this.projectId = projectId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDataEntity(dataEntity: ProjectCardEntity): ProjectCard {
    return new ProjectCard({
      id: dataEntity.id,
      title: dataEntity.title,
      content: dataEntity.content,
      type: dataEntity.type,
      creatorId: _.get(dataEntity, ['creator', 'id'], null),
      assigneeId: _.get(dataEntity, ['assignee', 'id'], null),
      columnId: _.get(dataEntity, ['column', 'id'], null),
      kanbanId: _.get(dataEntity, ['kanban', 'id'], null),
      projectId: _.get(dataEntity, ['project', 'id'], null),
      createdAt: dataEntity.createdAt,
      updatedAt: dataEntity.updatedAt
    });
  }

  public async initOrder(): Promise<void> {
    this.orderInKanban = (await ProjectCardRepository.getColumnCardCount(this.columnId)) * 100;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      type: this.type,
      creatorId: this.creatorId,
      columnId: this.columnId,
      order: this.orderInKanban,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
