import { ProjectEntity } from './../../entity/project.entity';
import { KanbanSettingEntity } from './../../entity/kanban-setting.entity';
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
      .leftJoinAndSelect('kanban.project', 'project')
      .getMany();

    return KanbanEntitys.map((kanbanEntity: KanbanEntity) => {
      return Kanban.fromDataEntity(kanbanEntity);
    });
  }

  static async getKanban(kanbanId: string): Promise<Kanban> {
    const kanbanEntity = await getRepository(KanbanEntity)
      .createQueryBuilder('kanban')
      .where('id = :kanbanId', { kanbanId })
      .leftJoinAndSelect('kanban.creator', 'user')
      .leftJoinAndSelect('kanban.setting', 'kanban_setting')
      .leftJoinAndSelect('kanban.project', 'project')
      .getOne();

    return Kanban.fromDataEntity(kanbanEntity);
  }

  static async savekanban(kanban: Kanban): Promise<KanbanId> {
    const creator = new UserEntity();
    creator.id = kanban.creatorId;

    const kanbanSettingEntity = new KanbanSettingEntity();

    const projectEntity = new ProjectEntity();
    projectEntity.id = kanban.projectId;

    const kanbanEntity = new KanbanEntity();
    kanbanEntity.name = kanban.name;
    kanbanEntity.desc = kanban.desc;
    kanbanEntity.type = kanban.type;
    kanbanEntity.project = projectEntity;
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
