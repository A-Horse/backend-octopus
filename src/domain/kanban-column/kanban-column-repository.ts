import { UserEntity } from './../../entity/user.entity';
import { KanbanColumnEntity } from './../../entity/kanban-column.entity';
import { getRepository } from 'typeorm';
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
    
      static async createProject(column: KanbanColumn): Promise<string> {
        const creator = new UserEntity();
        creator.id = column.creatorId;
    
        const kanbanColumnEntity = new KanbanColumnEntity();
        kanbanColumnEntity.name = column.name;
        colukanbanColumnEntitymn.status = column.status;
        projectEntity.creator = creator;
        projectEntity.owner = creator;
        projectEntity.setting = projectSettingEntity;
    
        await getConnection().transaction(
          async (transactionalEntityManager: EntityManager) => {
            await transactionalEntityManager.save(projectSettingEntity);
            await transactionalEntityManager.save(projectEntity);
          }
        );
    
        return projectEntity.id;
      }
}