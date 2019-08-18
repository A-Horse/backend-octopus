import { UserEntity } from './../../entity/user.entity';
import { KanbanColumnEntity } from './../../entity/kanban-column.entity';
import { getRepository, getConnection } from 'typeorm';
import { KanbanColumn } from './kanban-column';


export class KanbanColumnRepository {
    constructor() {}

    static async getKanbanColumns(kanbanId: number): Promise<KanbanColumn[]> {
        const columnEntitys = await getRepository(KanbanColumnEntity)
          .createQueryBuilder('kanban_column')
          .leftJoinAndSelect('kanban_column.creator', 'user as creator')
          .where('kanbanId = :kanbanId', { kanbanId })
          .getMany();
    
        return columnEntitys.map((kanbanColumnEntity: KanbanColumnEntity) => {
          return KanbanColumn.fromDataEntity(kanbanColumnEntity);
        });
      }

      static async getKanbanColumnCount(kanbanId: string): Promise<number> {
        return await getRepository(KanbanColumnEntity)
        .createQueryBuilder('kanban_column')
        .where('kanbanId = :kanbanId')
        .getCount();
      }
    
      static async createKanbanColumn(column: KanbanColumn): Promise<string> {
        const creator = new UserEntity();
        creator.id = column.creatorId;
    
        const kanbanColumnEntity = new KanbanColumnEntity();
        kanbanColumnEntity.name = column.name;
        kanbanColumnEntity.status = column.status;
        kanbanColumnEntity.creator = creator;

        column.initOrder();
        kanbanColumnEntity.order = column.order;
    
        await getRepository(KanbanColumnEntity).save(kanbanColumnEntity);
    
        return kanbanColumnEntity.id;
      }
}