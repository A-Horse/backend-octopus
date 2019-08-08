import { ProjectEntity } from './../../entity/project.entity';
import { getRepository } from 'typeorm';
import { Project } from "./model/project";


export class ProjectRepository {
    constructor() {}

    public async getUserProject(userId: string): Promise<Project[]> {
        const projectEntitys = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.setting', 'project_setting')
      .where('creatorId = :userId', { userId })
      .getMany();

    return projectEntitys.map((projectEntity: ProjectEntity) => {
      const project = new Project();
      project.id = projectEntity.id;
      project.name = projectEntity.name;
      project.desc = projectEntity.desc;

      const taskBoardSetting = TaskBoardSetting.fromData(projectEntity.setting);

      board.setting = taskBoardSetting;

      return board;
    });
    }

}