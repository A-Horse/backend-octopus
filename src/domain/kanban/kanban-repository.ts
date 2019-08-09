import { KanbanEntity } from './../../entity/kanban.entity';
import { Kanban } from './kanban';
import { getRepository } from 'typeorm';


export class KanbanRepository {
  

    static async getProjectKanbans(projectId: string): Promise<Kanban[]> {
       const KanbanEntitys =  await getRepository(KanbanEntity)
        .createQueryBuilder('kanban')
        .where('projectId = :projectId', {projectId})
        .leftJoinAndSelect('kanban.creator', 'user')
        .leftJoinAndSelect('kanban.setting', 'kanban_setting')
        .getMany();

        return KanbanEntitys.map((kanbanEntity: KanbanEntity) => {
            return Kanban.fromDataEntity(kanbanEntity);
        });
    }
}