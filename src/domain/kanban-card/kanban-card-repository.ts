import { ProjectEntity } from './../../entity/project.entity';
import { KanbanEntity } from './../../entity/kanban.entity';
import { KanbanColumnEntity } from './../../entity/kanban-column.entity';
import { UserEntity } from './../../entity/user.entity';
import { KanbanCard } from './kanban-card';
import { ProjectCardEntity } from '../../entity/project-card.entity';
import { getRepository } from 'typeorm';

export class KanbanCardRepository {
  static async getColumnCardCount(columnId: string): Promise<number> {
    return await getRepository(ProjectCardEntity)
      .createQueryBuilder('kanban_card')
      .where('columnId = :columnId', { columnId })
      .getCount();
  }

  static async getColumnCards(columnId: string): Promise<KanbanCard[]> {
    const cardEntitys = await getRepository(ProjectCardEntity)
      .createQueryBuilder('kanban_card')
      .leftJoinAndSelect('kanban_card.creator', 'user as creator')
      .leftJoinAndSelect('kanban_card.assignee', 'user as assignee')
      .leftJoinAndSelect('kanban_card.column', 'column')
      .where('columnId = :columnId', { columnId })
      .getMany();

    return cardEntitys
      .map((cardEntity: ProjectCardEntity) => {
        return KanbanCard.fromDataEntity(cardEntity);
      })
      .sort((a, b) => a.order - b.order);
  }

  static async saveKanbanCard(card: KanbanCard): Promise<string> {
    const cardEntity = new ProjectCardEntity();

    const creator = new UserEntity();
    creator.id = card.creatorId;
    cardEntity.creator = creator;

    const projectEntity = new ProjectEntity();
    projectEntity.id = card.projectId;
    cardEntity.project = projectEntity;

    if (card.kanbanId) {
      const kanbanEntity = new KanbanEntity();
      kanbanEntity.id = card.kanbanId;
      cardEntity.kanban = kanbanEntity;
    }

    if (card.columnId) {
      const kanbanColumnEntity = new KanbanColumnEntity();
      kanbanColumnEntity.id = card.columnId;
      cardEntity.column = kanbanColumnEntity;
    }

    cardEntity.title = card.title;
    cardEntity.content = card.content;

    await card.initOrder();
    cardEntity.order = card.order;

    await getRepository(ProjectCardEntity).save(cardEntity);

    return cardEntity.id;
  }
}
