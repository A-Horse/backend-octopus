import { KanbanColumnEntity } from './../../entity/kanban-column.entity';
import { getRepository } from 'typeorm';
import { KanbanColumn } from './kanban-column';


export class KanbanColumnRepository {
    constructor() {}

    static async getKanbanColumns(kanbanId: number): Promise<KanbanColumn[]> {
        const projectEntitys = await getRepository(KanbanColumnEntity)
          .createQueryBuilder('kanban_column')
          .leftJoinAndSelect('kanban_column.creator', 'user as creator')
          .leftJoinAndSelect('project.owner', 'user as owner')
          .where('creatorId = :kanbanId', { kanbanId })
          .getMany();
    
        return projectEntitys.map((projectEntity: ProjectEntity) => {
          return Project.fromDataEntity(projectEntity);
        });
      }
    
      static async getProjectDetail(projectId: string) {
        const projectEntity = await getRepository(ProjectEntity)
          .createQueryBuilder('project')
          .leftJoinAndSelect('project.setting', 'project_setting')
          .leftJoinAndSelect('project.creator', 'user as creator')
          .leftJoinAndSelect('project.owner', 'user as owner')
          .where('project.id = :projectId', { projectId })
          .getOne();
    
        return Project.fromDataEntity(projectEntity);
      }
    
      static async createProject(project: Project): Promise<string> {
        const creator = new UserEntity();
        creator.id = project.creatorId;
    
        const projectSettingEntity = new ProjectSettingEntity();
        projectSettingEntity.cover = project.setting.cover;
    
        const projectEntity = new ProjectEntity();
        projectEntity.name = project.name;
        projectEntity.desc = project.desc;
        projectEntity.type = project.type;
        projectEntity.status = project.status;
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