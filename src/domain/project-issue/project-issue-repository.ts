import { ProjectEntity } from '../../entity/project.entity';
import { KanbanEntity } from '../../entity/kanban.entity';
import { KanbanColumnEntity } from '../../entity/kanban-column.entity';
import { UserEntity } from '../../entity/user.entity';
import { ProjectIssue } from './project-issue';
import * as _ from 'lodash';
import { ProjectIssueEntity } from '../../entity/project-issue.entity';
import {
  getRepository,
  getConnection,
  EntityManager,
} from 'typeorm';
import { ProjectIssueOrderInKanbanEntity } from '../../entity/project-card-order-in-kanban.entity';
import { ProjectIssueDetail } from './project-issue-detail';
import { ProjectIssueDetailEntity } from '../../entity/project-issue-detail.entity';

export class ProjectIssueRepository {
  static async getKanbanCardCount(kanbanId: string): Promise<number> {
    return await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .where('kanbanId = :kanbanId', { kanbanId })
      .getCount();
  }

  static async getProjectIssueCount(projectId: string): Promise<number> {
    return await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .where('projectId = :projectId', { projectId })
      .getCount();
  }

  static async udpateIssue(issue: ProjectIssue): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(ProjectIssueEntity)
      .set({
        title: issue.title
      })
      .where({ id: issue.id })
      .execute();

    if (issue.detail) {
      await ProjectIssueRepository.updateIssueDetail(issue.id, issue.detail);
    }
  }

  static async updateIssueDetail(
    issueId: string,
    issueDetail: ProjectIssueDetail
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(ProjectIssueDetailEntity)
      .set({
        content: issueDetail.content
      })
      .where({ issueId: issueId })
      .execute();
  }

  static async getProjectIssues({
    projectId,
    pageSize,
    pageNumber
  }): Promise<ProjectIssue[]> {
    const cardEntitys = await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .leftJoinAndSelect('project_issue.creator', 'user as creator')
      .leftJoinAndSelect('project_issue.assignee', 'user as assignee')
      .leftJoinAndSelect('project_issue.column', 'column')
      .leftJoinAndMapOne(
        'project_issue.orderInKanban',
        ProjectIssueOrderInKanbanEntity,
        'project_issue_order_in_kanban',
        'project_issue.id = project_issue_order_in_kanban.cardId'
      )
      .where('projectId = :projectId', { projectId })
      .limit(pageSize)
      .offset(pageSize * pageNumber)
      .getMany();

    return cardEntitys
      .map((cardEntity: ProjectIssueEntity) => {
        return ProjectIssue.fromDataEntity({
          ...cardEntity,
          orderInKanban: _.get(cardEntity, ['orderInKanban', 'order'], null)
        });
      })
      .sort((a, b) => a.orderInKanban - b.orderInKanban);
  }

  static async getPreviousOrderInKanban(
    kanbanId: string,
    order: number
  ): Promise<number | null> {
    return await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .leftJoinAndMapOne(
        'project_issue.orderInKanban',
        ProjectIssueOrderInKanbanEntity,
        'project_issue_order_in_kanban',
        'project_issue.id = project_issue_order_in_kanban.cardId'
      )
      .where(
        'project_issue.kanbanId = :kanbanId and project_issue_order_in_kanban.order < :order',
        {
          kanbanId,
          order
        }
      )
      .orderBy('project_issue_order_in_kanban.order', 'DESC')
      .limit(1)
      .getOne()
      .then(card => {
        return _.get(card, ['orderInKanban', 'order'], null);
      });
  }

  static async getMinOrderInKanban(kanbanId: string): Promise<number | null> {
    return await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .leftJoinAndMapOne(
        'project_issue.orderInKanban',
        ProjectIssueOrderInKanbanEntity,
        'project_issue_order_in_kanban',
        'project_issue.id = project_issue_order_in_kanban.cardId'
      )
      .where('project_issue.kanbanId = :kanbanId', {
        kanbanId
      })
      .orderBy('project_issue_order_in_kanban.order', 'ASC')
      .limit(1)
      .getOne()
      .then(card => {
        return _.get(card, ['orderInKanban', 'order']);
      });
  }

  static async getMaxOrderInKanban(kanbanId: string): Promise<number | null> {
    return await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .leftJoinAndMapOne(
        'project_issue.orderInKanban',
        ProjectIssueOrderInKanbanEntity,
        'project_issue_order_in_kanban',
        'project_issue.id = project_issue_order_in_kanban.cardId'
      )
      .where('project_issue.kanbanId = :kanbanId', {
        kanbanId
      })
      .orderBy('project_issue_order_in_kanban.order', 'DESC')
      .limit(1)
      .getOne()
      .then(card => {
        return _.get(card, ['orderInKanban', 'order']);
      });
  }

  static async getNextOrderInKanban(
    kanbanId: string,
    order: number
  ): Promise<number | null> {
    return await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .leftJoinAndMapOne(
        'project_issue.orderInKanban',
        ProjectIssueOrderInKanbanEntity,
        'project_issue_order_in_kanban',
        'project_issue.id = project_issue_order_in_kanban.cardId'
      )
      .where(
        'project_issue.kanbanId = :kanbanId and project_issue_order_in_kanban.order > :order',
        {
          kanbanId,
          order
        }
      )
      .limit(1)
      .getOne()
      .then(card => _.get(card, ['orderInKanban', 'order'], null));
  }

  static async getIssue(cardId: string): Promise<ProjectIssue> {
    const cardEntity = await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .leftJoinAndSelect('project_issue.creator', 'user as creator')
      .leftJoinAndSelect('project_issue.assignee', 'user as assignee')
      .leftJoinAndSelect('project_issue.column', 'column')
      .leftJoinAndSelect('project_issue.kanban', 'kanban')
      .leftJoinAndMapOne(
        'project_issue.orderInKanban',
        ProjectIssueOrderInKanbanEntity,
        'project_issue_order_in_kanban',
        'project_issue.id = project_issue_order_in_kanban.cardId'
      )
      .where('project_issue.id = :cardId', { cardId })
      .getOne();

    return [cardEntity]
      .map((cardEntity: ProjectIssueEntity) => {
        return ProjectIssue.fromDataEntity({
          ...cardEntity,
          orderInKanban: _.get(cardEntity, ['orderInKanban', 'order'], null)
        });
      })
      .sort((a, b) => a.orderInKanban - b.orderInKanban)[0];
  }

  static async getIssueDetail(cardId: string): Promise<ProjectIssueDetail> {
    const issueDetailEntity = await getRepository(ProjectIssueDetailEntity)
      .createQueryBuilder('project_issue_detail')
      .where('project_issue_detail.cardId = :cardId', { cardId })
      .getOne();

    const issueDetail: ProjectIssueDetail = new ProjectIssueDetail();
    issueDetail.content = issueDetailEntity.content;

    return issueDetail;
  }

  static async getColumnCards(
    kanbanId: string,
    columnId: string
  ): Promise<ProjectIssue[]> {
    const cardEntitys = await getRepository(ProjectIssueEntity)
      .createQueryBuilder('project_issue')
      .leftJoinAndSelect('project_issue.creator', 'user as creator')
      .leftJoinAndSelect('project_issue.assignee', 'user as assignee')
      .leftJoinAndSelect('project_issue.column', 'column')
      .leftJoinAndMapOne(
        'project_issue.orderInKanban',
        ProjectIssueOrderInKanbanEntity,
        'project_issue_order_in_kanban',
        'project_issue.id = project_issue_order_in_kanban.cardId'
      )
      .where('columnId = :columnId', { columnId })
      .getMany();

    return cardEntitys
      .map((cardEntity: ProjectIssueEntity) => {
        return ProjectIssue.fromDataEntity({
          ...cardEntity,
          orderInKanban: _.get(cardEntity, ['orderInKanban', 'order'], null)
        });
      })
      .sort((a, b) => a.orderInKanban - b.orderInKanban);
  }

  static async saveProjectIssue(card: ProjectIssue): Promise<string> {
    const cardEntity = new ProjectIssueEntity();

    const creator = new UserEntity();
    creator.id = card.creatorId;
    cardEntity.creator = creator;

    const projectEntity = new ProjectEntity();
    projectEntity.id = card.projectId;
    cardEntity.project = projectEntity;

    let orderInkanbanEntity: ProjectIssueOrderInKanbanEntity;

    if (card.kanbanId) {
      const kanbanEntity = new KanbanEntity();
      kanbanEntity.id = card.kanbanId;
      cardEntity.kanban = kanbanEntity;

      await card.initOrderInKanban();

      orderInkanbanEntity = new ProjectIssueOrderInKanbanEntity();
      orderInkanbanEntity.card = cardEntity;
      orderInkanbanEntity.kanban = kanbanEntity;
      orderInkanbanEntity.order = card.orderInKanban;
    }

    if (card.columnId) {
      const kanbanColumnEntity = new KanbanColumnEntity();
      kanbanColumnEntity.id = card.columnId;
      cardEntity.column = kanbanColumnEntity;
    }

    cardEntity.id = card.id;
    cardEntity.title = card.title;

    const projectIssueDetailEntity: ProjectIssueDetailEntity = new ProjectIssueDetailEntity();

    if (card.detail) {
      projectIssueDetailEntity.content = card.detail.content;
    }

    await getConnection().transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.save(cardEntity);
        projectIssueDetailEntity.cardId = cardEntity.id;

        await transactionalEntityManager.save(projectIssueDetailEntity);

        if (orderInkanbanEntity) {
          await transactionalEntityManager.save(orderInkanbanEntity);
        }
      }
    );

    return cardEntity.id;
  }

  static async updateCardOrderInKanban(card: ProjectIssue): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(ProjectIssueOrderInKanbanEntity)
      .set({
        order: card.orderInKanban
      })
      .where('kanbanId = :kanbanId and cardId = :cardId', {
        kanbanId: card.kanbanId,
        cardId: card.id
      })
      .execute();
  }
}
