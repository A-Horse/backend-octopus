import { KanbanSettingEntity } from './../../entity/kanban-setting.entity';
import { ProjectSettingEntity } from './../../entity/project-setting.entity';
import { UserEntity } from './../../entity/user.entity';
import { KanbanId } from './../../typing/kanban.typing';
import { KanbanEntity } from './../../entity/kanban.entity';
import { Kanban } from './kanban';
import { getRepository, getConnection, EntityManager } from 'typeorm';

export class KanbanRepository {
  static async getProjectKanbans(projectId: string): Promise<Kanban[]> {
    const KanbanEntitys = await getRepository(KanbanEntity)
      .createQueryBuilder('kanban')
      .where('projectId = :projectId', { projectId })
      .leftJoinAndSelect('kanban.creator', 'user')
      .leftJoinAndSelect('kanban.setting', 'kanban_setting')
      .getMany();

    return KanbanEntitys.map((kanbanEntity: KanbanEntity) => {
      return Kanban.fromDataEntity(kanbanEntity);
    });
  }

  static async savekanban(kanban: Kanban): Promise<KanbanId> {
    const creator = new UserEntity();
    creator.id = kanban.creatorId;

    const kanbanSettingEntity = new KanbanSettingEntity();

    const kanbanEntity = new KanbanEntity();
    kanbanEntity.id = kanban.id;
    kanbanEntity.name = name;
    kanbanEntity.desc = kanban.desc;
    kanbanEntity.type = kanban.type;
    kanbanEntity.creator = creator;
    kanbanEntity.setting = kanbanSettingEntity;

    await getConnection().transaction(
      async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.save(kanbanSettingEntity);
        await transactionalEntityManager.save(kanbanEntity);
      }
    );
    return kanbanEntity.id;
  }
}
