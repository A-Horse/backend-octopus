import { ProjectIssueRepository } from './project-issue-repository';
import { ProjectIssue } from './project-issue';
import { CreateProjectIssueInput } from '../../typing/kanban-card.typing';
import { PagtiationList } from 'src/typing/pagtiation.typing';
import { ProjectIssueDetail } from './project-issue-detail';

export class ProjectIssueApplicationService {
  static async getColumnIssues({ kanbanId, columnId }): Promise<ProjectIssue[]> {
    return ProjectIssueRepository.getColumnCards(kanbanId, columnId);
  }

  static async createIssue(
    createProjectIssueInput: CreateProjectIssueInput
  ): Promise<string> {
    const issue = new ProjectIssue({
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
    issue.setDetail(new ProjectIssueDetail({
      issueId: null
    }))
    await issue.initCardId();
    return ProjectIssueRepository.saveProjectIssue(issue);
  }

  static async udpateIssue(issueId: string, partialIssueData: any): Promise<void> {
    const issue = await ProjectIssueApplicationService.getDetailedIssue(issueId);
    issue.setPartialField(partialIssueData);
    await issue.save();
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
