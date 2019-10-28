import { EntityManager, getConnection, getRepository } from 'typeorm';

import { ProjectSettingEntity } from '../../entity/project-setting.entity';
import { ProjectEntity } from '../../entity/project.entity';
import { UserEntity } from '../../entity/user.entity';
import { Project } from './model/project';
import { ProjectSetting } from './model/project-setting';
import { KanbanEntity } from '../../entity/kanban.entity';

export class ProjectRepository {
  static async getAllProjectCount(): Promise<number> {
    return await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .getCount();
  }

  static async getUserProjects(userId: number): Promise<Project[]> {
    const projectEntitys = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.setting', 'project_setting')
      .leftJoinAndSelect(
        'project_setting.defaultKanban',
        'kanban as project_default_kanban'
      )
      .leftJoinAndSelect('project.creator', 'user as creator')
      .leftJoinAndSelect('project.owner', 'user as owner')
      .where('project.creatorId = :userId', { userId })
      .getMany();

    return projectEntitys.map((projectEntity: ProjectEntity) => {
      return Project.fromDataEntity(projectEntity);
    });
  }

  static async getProjectDetail(projectId: string): Promise<Project> {
    const projectEntity = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.setting', 'project_setting')
      .leftJoinAndSelect('project_setting.defaultKanban', 'kanban')
      .leftJoinAndSelect('project.creator', 'user as creator')
      .leftJoinAndSelect('project.owner', 'user as owner')
      .where('project.id = :projectId', { projectId })
      .getOne();

    return Project.fromDataEntity(projectEntity);
  }

  static async saveProject(project: Project): Promise<string> {
    const creator = new UserEntity();
    creator.id = project.creatorId;

    const projectSettingEntity = new ProjectSettingEntity();
    projectSettingEntity.cover = project.setting.cover;

    const projectEntity = new ProjectEntity();
    projectEntity.id = project.id;
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

  static async updateProjectSetting(setting: ProjectSetting): Promise<void> {
    let defaultKanbanEntity: KanbanEntity;
    if (setting.defaultKanbanId) {
      
      defaultKanbanEntity = new KanbanEntity();
      defaultKanbanEntity.id = setting.defaultKanbanId;
    }

    await getConnection()
      .createQueryBuilder()
      .update(ProjectSettingEntity)
      .set({
        defaultKanban: defaultKanbanEntity,
        isStar: setting.isStar,
        cover: setting.cover
      })
      .where({ id: setting.id })
      .execute();
  }

  
}
