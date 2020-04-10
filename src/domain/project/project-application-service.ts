import { CreateKanbanInput, KanbanId } from '../../typing/kanban.typing';
import { KanbanRepository } from '../kanban/kanban-repository';
import { Project } from './model/project';
import { ProjectIdFactory } from './model/project-id-factory';
import { ProjectSetting } from './model/project-setting';
import { ProjectRepository } from './project-repository';
import { ImageService } from '../../service/image.service';
import { DIContainer } from '../../container/di-container';
import { UpdateProjectCommand } from './command/update-project-command';

export class ProjectApplicationService {
  constructor(private container: DIContainer) {}

  static getUserProjects(userId: number): Promise<Project[]> {
    return ProjectRepository.getUserProjects(userId);
  }

  getProjectDetail(projectId: string): Promise<Project> {
    const projectRepo: ProjectRepository = this.container.projectRepository;
    return projectRepo.findWithDetail(projectId);
  }

  static async createProject(projectData: any): Promise<string> {
    const idFactory = new ProjectIdFactory();
    const id = await idFactory.generateId();

    const project = new Project({
      id: id,
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

  async createProjectKanban(createKanbanInput: CreateKanbanInput): Promise<KanbanId> {
    const projectRepo: ProjectRepository = this.container.projectRepository;
    const project: Project = await projectRepo.findWithDetail(createKanbanInput.projectId);
    const kanban = await project.createKanban(createKanbanInput);
    return await KanbanRepository.saveKanban(kanban);
  }

  async setProjectDefaultKanban({ projectId, kanbanId }): Promise<void> {
    const projectRepo: ProjectRepository = this.container.projectRepository;
    const project: Project = await projectRepo.findWithDetail(projectId);
    await project.setDefaultKanban(kanbanId);
  }

  async updateProjectCover(projectId: string, coverBase64: string) {
    const projectRepo: ProjectRepository = this.container.projectRepository;
    const id: string = await this.container.imageService.saveBase64Image(coverBase64.replace(/^data:image\/png;base64,/, ''));
    const project: Project = await projectRepo.findWithDetail(projectId);
    await project.setCoverBase64ID(id);
    await ProjectRepository.updateProjectSetting(project.setting);
    return id;
  }

  async updateProject(projectID: string, updateCommand: UpdateProjectCommand) {
    const projectRepo: ProjectRepository = this.container.projectRepository;
    const project: Project = await projectRepo.findWithDetail(projectID);
    project.name = updateCommand.name || project.name;
    await projectRepo.save(project);
  }
}
