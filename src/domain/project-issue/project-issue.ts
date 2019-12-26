import * as _ from 'lodash';

import { ProjectIssueEntity } from '../../orm/project-issue.entity';
import { ProjectIssueType } from '../../typing/kanban-card.typing';
import { JSONEntity } from '../interface/json';
import { PROJECT_CARD_ORDER_INIT_INTERVAL } from './constant';
import { ProjectIssueDetail } from './project-issue-detail';
import { ProjectIssueRepository } from './project-issue-repository';
import { setPartialIssueData } from './util/issue-util';

export class ProjectIssue implements JSONEntity {
  public id: string;
  public title: string;
  public type: ProjectIssueType;
  public creatorId: number;
  public assigneeId: number;
  public deadline?: Date;
  public deadlineDone?: boolean;
  public columnId: string;
  public kanbanId: string;
  public projectId: string;
  public orderInKanban: number;
  public createdAt: Date;
  public updatedAt: Date;
  private  detail?: ProjectIssueDetail;

  public getDetail() {
    return this.detail;
  }

  public setDetail(detail: ProjectIssueDetail) {
    this.detail = detail;
  }

  constructor({
    id,
    title,
    type,
    creatorId,
    assigneeId,
    columnId,
    kanbanId,
    orderInKanban,
    projectId,
    deadline,
    deadlineDone,
    createdAt,
    updatedAt
  }: any) {
    this.id = id;
    this.title = title;
    this.type = type || ProjectIssueType.NORMAL;
    this.creatorId = creatorId;
    this.assigneeId = assigneeId;
    this.columnId = columnId;
    this.kanbanId = kanbanId;
    this.orderInKanban = orderInKanban;
    this.projectId = projectId;
    this.deadline = deadline;
    this.deadlineDone = deadlineDone;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDataEntity(dataEntity: ProjectIssueEntity): ProjectIssue {
    return new ProjectIssue({
      id: dataEntity.id,
      title: dataEntity.title,
      type: dataEntity.type,
      orderInKanban: dataEntity.orderInKanban,
      creatorId: _.get(dataEntity, ['creator', 'id'], null),
      assigneeId: _.get(dataEntity, ['assignee', 'id'], null),
      columnId: _.get(dataEntity, ['column', 'id'], null),
      kanbanId: _.get(dataEntity, ['kanban', 'id'], null),
      projectId: _.get(dataEntity, ['project', 'id'], null),
      deadline: _.get(dataEntity, ['deadline'], null),
      createdAt: dataEntity.createdAt,
      updatedAt: dataEntity.updatedAt
    });
  }

  public async initCardId(): Promise<void> {
    const cardCountInProject = await ProjectIssueRepository.getProjectIssueCount(
      this.projectId
    );
    this.id = `${this.projectId}-${cardCountInProject.toString()}`;
  }

  public async initOrderInKanban(): Promise<void> {
    this.orderInKanban =
      (await ProjectIssueRepository.getKanbanCardCount(this.kanbanId)) *
      PROJECT_CARD_ORDER_INIT_INTERVAL;
  }

  public async calcPreviousOrderInKanban(): Promise<number | null> {
    return await ProjectIssueRepository.getPreviousOrderInKanban(
      this.kanbanId,
      this.orderInKanban
    );
  }

  public async calcNextOrderInKanban(): Promise<number | null> {
    return await ProjectIssueRepository.getNextOrderInKanban(
      this.kanbanId,
      this.orderInKanban
    );
  }

  public async pullDetail(): Promise<void> {
    this.detail = await ProjectIssueRepository.getIssueDetail(this.id);
  }

  public setPartialField(partialField: any): void {
    setPartialIssueData(this, partialField);
  }

  public async save(): Promise<void> {
    // TODO: udpate and save 
    await ProjectIssueRepository.udpateIssue(this);
  }

  public toJSON() {
    const detailJSON = this.detail ? this.detail.toJSON() : null;
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      creatorId: this.creatorId,
      columnId: this.columnId,
      order: this.orderInKanban,
      deadline: this.deadline,
      deadlineDone: this.deadlineDone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...detailJSON
    };
  }
}
