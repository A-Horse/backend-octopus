import { ProjectEntity } from '../../entity/project.entity';
import { KanbanEntity } from '../../entity/kanban.entity';
import { KanbanColumnEntity } from '../../entity/kanban-column.entity';
import { UserEntity } from '../../entity/user.entity';
import { ProjectCard } from './project-card';
import * as _ from 'lodash';
import { ProjectCardEntity } from '../../entity/project-card.entity';
import { getRepository, getConnection, EntityManager } from 'typeorm';
import { ProjectCardOrderInKanbanEntity } from '../../entity/project-card-order-in-kanban.entity';

export class ProjectCardRepository {
  static async getKanbanCardCount(kanbanId: string): Promise<number> {
    return await getRepository(ProjectCardEntity)
      .createQueryBuilder('kanban_card')
      .where('kanbanId = :kanbanId', { kanbanId })
      .getCount();
  }

  static async getPreviousOrderInKanban(
    kanbanId: string,
    order: number
  ): Promise<number | null> {
    return await getRepository(ProjectCardEntity)
      .createQueryBuilder('kanban_card')
      .leftJoinAndMapOne(
        'kanban_card.orderInKanban',
        ProjectCardOrderInKanbanEntity,
        'project_card_order_in_kanban',
        'kanban_card.id = project_card_order_in_kanban.cardId'
      )
      .where(
        'kanban_card.kanbanId = :kanbanId and project_card_order_in_kanban.order < :order',
        {
          kanbanId,
          order
        }
      )
      .limit(1)
      .getOne()
      .then(card => _.get(card, ['orderInKanban', 'order'], null));
  }

  static async getNextOrderInKanban(
    kanbanId: string,
    order: number
  ): Promise<number | null> {
    return await getRepository(ProjectCardEntity)
      .createQueryBuilder('kanban_card')
      .leftJoinAndMapOne(
        'kanban_card.orderInKanban',
        ProjectCardOrderInKanbanEntity,
        'project_card_order_in_kanban',
        'kanban_card.id = project_card_order_in_kanban.cardId'
      )
      .where(
        'kanban_card.kanbanId = :kanbanId and project_card_order_in_kanban.order > :order',
        {
          kanbanId,
          order
        }
      )
      .limit(1)
      .getOne()
      .then(card => _.get(card, ['orderInKanban', 'order'], null));
  }

  static async getCard(cardId: string): Promise<ProjectCard> {
    const cardEntity = await getRepository(ProjectCardEntity)
      .createQueryBuilder('kanban_card')
      .leftJoinAndSelect('kanban_card.creator', 'user as creator')
      .leftJoinAndSelect('kanban_card.assignee', 'user as assignee')
      .leftJoinAndSelect('kanban_card.column', 'column')
      .leftJoinAndMapOne(
        'kanban_card.orderInKanban',
        ProjectCardOrderInKanbanEntity,
        'project_card_order_in_kanban',
        'kanban_card.id = project_card_order_in_kanban.cardId'
      )
      .where('kanban_card.id = :cardId', { cardId })
      .getOne();

    return [cardEntity]
      .map((cardEntity: ProjectCardEntity) => {
        return ProjectCard.fromDataEntity({
          ...cardEntity,
          orderInKanban: _.get(cardEntity, ['orderInKanban', 'order'], null)
        });
      })
      .sort((a, b) => a.orderInKanban - b.orderInKanban)[0];
  }

  static async getColumnCards(
    kanbanId: string,
    columnId: string
  ): Promise<ProjectCard[]> {
    const cardEntitys = await getRepository(ProjectCardEntity)
      .createQueryBuilder('kanban_card')
      .leftJoinAndSelect('kanban_card.creator', 'user as creator')
      .leftJoinAndSelect('kanban_card.assignee', 'user as assignee')
      .leftJoinAndSelect('kanban_card.column', 'column')
      .leftJoinAndMapOne(
        'kanban_card.orderInKanban',
        ProjectCardOrderInKanbanEntity,
        'project_card_order_in_kanban',
        'kanban_card.id = project_card_order_in_kanban.cardId'
      )
      .where('columnId = :columnId', { columnId })
      .getMany();

    return cardEntitys
      .map((cardEntity: ProjectCardEntity) => {
        return ProjectCard.fromDataEntity({
          ...cardEntity,
          orderInKanban: _.get(cardEntity, ['orderInKanban', 'order'], null)
        });
      })
      .sort((a, b) => a.orderInKanban - b.orderInKanban);
  }

  static async saveProjectCard(card: ProjectCard): Promise<string> {
    const cardEntity = new ProjectCardEntity();

    const creator = new UserEntity();
    creator.id = card.creatorId;
    cardEntity.creator = creator;

    const projectEntity = new ProjectEntity();
    projectEntity.id = card.projectId;
    cardEntity.project = projectEntity;

    let orderInkanbanEntity: ProjectCardOrderInKanbanEntity;

    if (card.kanbanId) {
      const kanbanEntity = new KanbanEntity();
      kanbanEntity.id = card.kanbanId;
      cardEntity.kanban = kanbanEntity;

      await card.initOrderInKanban();

      orderInkanbanEntity = new ProjectCardOrderInKanbanEntity();
      orderInkanbanEntity.card = cardEntity;
      orderInkanbanEntity.kanban = kanbanEntity;
      orderInkanbanEntity.order = card.orderInKanban;
    }

    if (card.columnId) {
      const kanbanColumnEntity = new KanbanColumnEntity();
      kanbanColumnEntity.id = card.columnId;
      cardEntity.column = kanbanColumnEntity;
    }

    cardEntity.title = card.title;
    cardEntity.content = card.content;

    await getConnection().transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.save(cardEntity);

        if (orderInkanbanEntity) {
          await transactionalEntityManager.save(orderInkanbanEntity);
        }
      }
    );

    return cardEntity.id;
  }

  static async updateCardOrderInKanban(card: ProjectCard): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(ProjectCardOrderInKanbanEntity)
      .set({
        order: card.orderInKanban
      })
      .where({
        kanbanId: card.kanbanId,
        cardId: card.id
      })
      .execute();
  }
}