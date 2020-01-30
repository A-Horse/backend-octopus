import * as _ from 'lodash';
import { EntityManager, getConnection, getRepository, MongoError } from 'typeorm';
import { getMongoDB } from '../../database/mongo';
import { KanbanColumnEntity } from '../../orm/kanban-column.entity';
import { KanbanEntity } from '../../orm/kanban.entity';
import { ProjectIssueOrderInKanbanEntity } from '../../orm/project-card-order-in-kanban.entity';
import { ProjectIssueEntity } from '../../orm/project-issue.entity';
import { ProjectEntity } from '../../orm/project.entity';
import { UserEntity } from '../../orm/user.entity';
import { ProjectIssue } from './project-issue';
import { ProjectIssueDetail } from './project-issue-detail';

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
    const column = new KanbanColumnEntity();
    column.id = issue.columnId;
    await getConnection()
      .createQueryBuilder()
      .update(ProjectIssueEntity)
      .set({
        title: issue.title,
        deadline: issue.deadline,
        deadlineDone: issue.deadlineDone,
        column: column
      })
      .where({ id: issue.id })
      .execute();

    if (issue.getDetail()) {
      await ProjectIssueRepository.updateIssueDetail(issue.id, issue.getDetail());
    }
  }

  static async updateIssueDetail(
    issueId: string,
    issueDetail: ProjectIssueDetail
  ): Promise<void> {
    const mongoDB = await getMongoDB();
    return new Promise<void>((resolve, reject) => {
      mongoDB.collection('issue_detail').update(
        {
          issueId
        },
        issueDetail.toJSON(),
        (error: MongoError, result: any) => {
          if (error) {
            return reject(error);
          }
          return resolve();
        }
      );
    });
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
        'project_issue.id = project_issue_order_in_kanban.issueId'
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
        'project_issue.id = project_issue_order_in_kanban.issueId'
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
        'project_issue.id = project_issue_order_in_kanban.issueId'
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
        'project_issue.id = project_issue_order_in_kanban.issueId'
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
        'project_issue.id = project_issue_order_in_kanban.issueId'
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
        'project_issue.id = project_issue_order_in_kanban.issueId'
      )
      .where('project_issue.id = :cardId', { cardId })
      .getOne();

    return [cardEntity].map((cardEntity: ProjectIssueEntity) => {
      return ProjectIssue.fromDataEntity({
        ...cardEntity,
        orderInKanban: _.get(cardEntity, ['orderInKanban', 'order'], null)
      });
    })[0];
  }

  static async getIssueDetail(issueId: string): Promise<ProjectIssueDetail> {
    const mongoDB = await getMongoDB();
    const detailData: any = await new Promise((resolve, reject) => {
      mongoDB.collection('issue_detail').findOne(
        {
          issueId
        },
        (error: MongoError, result: any) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });

    let issueDetail: ProjectIssueDetail;

    if (!detailData) {
      await new Promise((resolve, reject) => {
        mongoDB.collection('issue_detail').insertOne({ issueId }, (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        });
      });
      issueDetail = new ProjectIssueDetail({ issueId });
    } else {
      issueDetail = new ProjectIssueDetail({ ...detailData });
    }
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
        'project_issue.id = project_issue_order_in_kanban.issueId'
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

  static async saveProjectIssue(issue: ProjectIssue): Promise<string> {
    const issueEntity = new ProjectIssueEntity();

    const creator = new UserEntity();
    creator.id = issue.creatorId;
    issueEntity.creator = creator;

    const projectEntity = new ProjectEntity();
    projectEntity.id = issue.projectId;
    issueEntity.project = projectEntity;

    let orderInkanbanEntity: ProjectIssueOrderInKanbanEntity;

    if (issue.kanbanId) {
      const kanbanEntity = new KanbanEntity();
      kanbanEntity.id = issue.kanbanId;
      issueEntity.kanban = kanbanEntity;

      await issue.initOrderInKanban();

      orderInkanbanEntity = new ProjectIssueOrderInKanbanEntity();
      orderInkanbanEntity.issue = issueEntity;
      orderInkanbanEntity.kanban = kanbanEntity;
      orderInkanbanEntity.order = issue.orderInKanban;
    }

    if (issue.columnId) {
      const kanbanColumnEntity = new KanbanColumnEntity();
      kanbanColumnEntity.id = issue.columnId;
      issueEntity.column = kanbanColumnEntity;
    }

    issueEntity.id = issue.id;
    issueEntity.title = issue.title;

    await getConnection().transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.save(issueEntity);

        if (orderInkanbanEntity) {
          await transactionalEntityManager.save(orderInkanbanEntity);
        }

        const mongoDB = await getMongoDB();

        await new Promise((resolve, reject) => {
          mongoDB
            .collection('issue_detail')
            .insertOne(issue.getDetail().toJSON(), (err, result) => {
              if (err) {
                return reject(err);
              }
              issue.getDetail().issueId = result.insertedId.toHexString();
              return resolve(result);
            });
        });
      }
    );

    return issueEntity.id;
  }

  static async updateCardOrderInKanban(issue: ProjectIssue): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(ProjectIssueOrderInKanbanEntity)
      .set({
        order: issue.orderInKanban
      })
      .where('kanbanId = :kanbanId and issueId = :issueId', {
        kanbanId: issue.kanbanId,
        issueId: issue.id
      })
      .execute();
  }
}
