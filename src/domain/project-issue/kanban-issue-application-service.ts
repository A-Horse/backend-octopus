import { ProjectIssueRepository } from './project-issue-repository';
import { ProjectIssue } from './project-issue';
import { CreateProjectIssueInput } from '../../typing/kanban-card.typing';
import { PagtiationList } from 'src/typing/pagtiation.typing';

export class ProjectIssueApplicationService {
  static async getColumnIssues({ kanbanId, columnId }): Promise<ProjectIssue[]> {
    return ProjectIssueRepository.getColumnCards(kanbanId, columnId);
  }

  static async createIssue(
    createProjectIssueInput: CreateProjectIssueInput
  ): Promise<string> {
    const card = new ProjectIssue({
      id: null,
      title: createProjectIssueInput.title,
      content: createProjectIssueInput.content,
      type: createProjectIssueInput.type,
      creatorId: createProjectIssueInput.creatorId,
      assigneeId: createProjectIssueInput.assigneeId,
      columnId: createProjectIssueInput.columnId,
      kanbanId: createProjectIssueInput.kanbanId,
      projectId: createProjectIssueInput.projectId,
      createdAt: undefined,
      updatedAt: undefined
    });
    await card.initCardId();
    return ProjectIssueRepository.saveProjectIssue(card);
  }

  static async getDetailedIssue(issueId: string): Promise<ProjectIssue> {
    const issue = await ProjectIssueRepository.getIssue(issueId);
    await issue.pullDetail();
    return issue;
  }

  static async getProjectIssues({
    projectId,
    pageSize,
    pageNumber
  }): Promise<PagtiationList<ProjectIssue>> {
    const issues = await ProjectIssueRepository.getProjectIssues({
      projectId,
      pageSize,
      pageNumber
    });
    return {
      pageNumber: pageNumber,
      pageSize: pageSize,
      total: await ProjectIssueRepository.getProjectIssueCount(projectId),
      data: issues
    };
  }
}
