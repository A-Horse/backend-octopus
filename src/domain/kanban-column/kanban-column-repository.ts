import { getConnection, getRepository } from 'typeorm';

import { KanbanColumnEntity } from '../../orm/kanban-column.entity';
import { KanbanEntity } from '../../orm/kanban.entity';
import { UserEntity } from '../../orm/user.entity';
import { KanbanColumn } from './kanban-column';

export class KanbanColumnRepository {
  constructor() {}

  static async getKanbanColumns(kanbanId: string): Promise<KanbanColumn[]> {
    const columnEntitys = await getRepository(KanbanColumnEntity)
      .createQueryBuilder('kanban_column')
      .leftJoinAndSelect('kanban_column.creator', 'user as creator')
      .leftJoinAndSelect('kanban_column.kanban', 'kanban')
      .where('kanbanId = :kanbanId', { kanbanId })
      .getMany();

    return columnEntitys
      .map((kanbanColumnEntity: KanbanColumnEntity) => {
        return KanbanColumn.fromDataEntity(kanbanColumnEntity);
      })
      .sort((a, b) => a.order - b.order);
  }

  static async getKanbanColumnCount(kanbanId: string): Promise<number> {
    return await getRepository(KanbanColumnEntity)
      .createQueryBuilder('kanban_column')
      .where('kanbanId = :kanbanId', { kanbanId })
      .getCount();
  }

  static async saveKanbanColumn(column: KanbanColumn): Promise<string> {
    const creator = new UserEntity();
    creator.id = column.creatorId;

    const kanbanEntity = new KanbanEntity();
    kanbanEntity.id = column.kanbanId;

    const kanbanColumnEntity = new KanbanColumnEntity();
    kanbanColumnEntity.name = column.name;
    kanbanColumnEntity.status = column.status;
    kanbanColumnEntity.creator = creator;
    kanbanColumnEntity.kanban = kanbanEntity;

    await column.initOrder();
    kanbanColumnEntity.order = column.order;

    await getRepository(KanbanColumnEntity).save(kanbanColumnEntity);

    return kanbanColumnEntity.id;
  }
}
