import { UserEntity } from './../../entity/user.entity';
import { ProjectSettingEntity } from './../../entity/project-setting.entity';
import { ProjectSetting } from './model/project-setting';
import { ProjectEntity } from './../../entity/project.entity';
import { getRepository, getConnection, EntityManager } from 'typeorm';
import { Project } from './model/project';

export class ProjectRepository {
  constructor() {}

  static async getUserProject(userId: string): Promise<Project[]> {
    const projectEntitys = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.setting', 'project_setting')
      .where('creatorId = :userId', { userId })
      .getMany();

    return projectEntitys.map((projectEntity: ProjectEntity) => {
      return Project.fromDataEntity(projectEntity);
    });
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

    await getConnection().transaction(async (transactionalEntityManager: EntityManager) => {
      await transactionalEntityManager.save(projectSettingEntity);

      await transactionalEntityManager.save(projectEntity);
    });
    
    return projectEntity.id;
  }
}
