import { ProjectIssueRepository } from './project-issue-repository';
import { ProjectCard } from './project-issue';
import { CreateProjectCardInput } from '../../typing/kanban-card.typing';

export class ProjectIssueApplicationService {
  static async getColumnCards({ kanbanId, columnId }): Promise<ProjectCard[]> {
    return ProjectIssueRepository.getColumnCards(kanbanId, columnId);
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
    return ProjectIssueRepository.saveProjectCard(card);
  }

  static async getProjectIssues({
    projectId,
    pageSize,
    pageNumber
  }): Promise<ProjectCard[]> {
    return await ProjectIssueRepository.getProjectIssues({
      projectId,
      pageSize,
      pageNumber
    });

  }
}
