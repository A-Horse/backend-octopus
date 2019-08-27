import { KanbanCardType } from 'src/typing/kanban-card.typing';

import { CreateKanbanInput } from '../../typing/kanban.typing';
import { Kanban } from '../kanban/kanban';
import { KanbanRepository } from '../kanban/kanban-repository';
import { KanbanSetting } from '../kanban/kanban-setting';
import { Project } from './model/project';
import { ProjectSetting } from './model/project-setting';
import { ProjectRepository } from './project-repository';

export class ProjectAppliactionService {
  static getUserProjects(userId: number): Promise<Project[]> {
    return ProjectRepository.getUserProjects(userId);
  }

  static getProjectDetail(projectId: string): Promise<Project> {
    return ProjectRepository.getProjectDetail(projectId);
  }

  static createProject(projectData: any): Promise<string> {
    const project = new Project({
      id: projectData.id,
      name: projectData.name,
      desc: projectData.desc,
      type: projectData.type,
      status: projectData.status,
      creatorId: projectData.creatorId,
      updatedAt: null,
      createdAt: null,
      setting: new ProjectSetting({
        id: null
      })
    });
    return ProjectRepository.saveProject(project);
  }

  static async createProjectKanban(createKanbanInput: CreateKanbanInput) {
    const project: Project = await ProjectRepository.getProjectDetail(
      createKanbanInput.projectId
    );

    const kanban = project.createKanban(createKanbanInput);
  }
}