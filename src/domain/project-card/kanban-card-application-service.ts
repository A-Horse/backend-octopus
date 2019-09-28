import { ProjectCardRepository } from './kanban-card-repository';
import { ProjectCard } from './project-card';
import { CreateProjectCardInput } from '../../typing/kanban-card.typing';

export class ProjectCardApplicationService {
  static async getColumnCards({ kanbanId, columnId }): Promise<ProjectCard[]> {
    return ProjectCardRepository.getColumnCards(kanbanId, columnId);
  }

  static async createCard(
    createProjectCardInput: CreateProjectCardInput
  ): Promise<string> {
    const card = new ProjectCard({
      id: null,
      title: createProjectCardInput.title,
      content: createProjectCardInput.content,
      type: createProjectCardInput.type,
      creatorId: createProjectCardInput.creatorId,
      assigneeId: createProjectCardInput.assigneeId,
      columnId: createProjectCardInput.columnId,
      kanbanId: createProjectCardInput.kanbanId,
      projectId: createProjectCardInput.projectId,
      createdAt: undefined,
      updatedAt: undefined
    });
    await card.initCardId();
    return ProjectCardRepository.saveProjectCard(card);
  }
}
