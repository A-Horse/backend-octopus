import { KanbanColumnEntity } from './../../entity/kanban-column.entity';
import { UserEntity } from './../../entity/user.entity';
import { KanbanCard } from './kanban-card';
import { KanbanCardEntity } from './../../entity/kanban-card.entity';
import { getRepository } from 'typeorm';

export class KanbanCardRepository {
  static async getColumnCardCount(columnId: string): Promise<number> {
    return await getRepository(KanbanCardEntity)
      .createQueryBuilder('kanban_card')
      .where('columnId = :columnId', { columnId })
      .getCount();
  }

  static async getColumnCards(columnId: string): Promise<KanbanCard[]> {
    const cardEntitys = await getRepository(KanbanCardEntity)
      .createQueryBuilder('kanban_card')
      .leftJoinAndSelect('kanban_card.creator', 'user as creator')
      .leftJoinAndSelect('kanban_card.assignee', 'user as assignee')
      .leftJoinAndSelect('kanban_card.column', 'column')
      .where('columnId = :columnId', { columnId })
      .getMany();

    return cardEntitys
      .map((cardEntity: KanbanCardEntity) => {
        return KanbanCard.fromDataEntity(cardEntity);
      })
      .sort((a, b) => a.order - b.order);
  }

  static async saveKanbanCard(card: KanbanCard): Promise<string> {
    const creator = new UserEntity();
    creator.id = card.creatorId;

    let kanbanColumnEntity;
    if (card.columnId) {
      kanbanColumnEntity = new KanbanColumnEntity();
      kanbanColumnEntity.id = card.columnId;
    }

    const cardEntity = new KanbanCardEntity();
    cardEntity.title = card.title;
    cardEntity.content = card.content;

    await card.initOrder();
    cardEntity.order = card.order;

    await getRepository(KanbanCardEntity).save(cardEntity);

    return cardEntity.id;
  }
}
