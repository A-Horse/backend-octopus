import { PagtiationList } from 'src/typing/pagtiation.typing';

import { CreateProjectIssueInput } from '../../typing/kanban-card.typing';
import { ProjectIssue } from './project-issue';
import { ProjectIssueDetail } from './project-issue-detail';
import { ProjectIssueRepository } from './project-issue-repository';

export class ProjectIssueApplicationService {
  static async getColumnIssues({ kanbanId, columnId }): Promise<ProjectIssue[]> {
    return ProjectIssueRepository.getColumnCards(kanbanId, columnId);
  }

  // TODO move to factory
  static async createIssue(createProjectIssueInput: CreateProjectIssueInput): Promise<string> {
    const issue = new ProjectIssue({
      id: null,
      title: createProjectIssueInput.title,
      type: createProjectIssueInput.type,
      creatorId: createProjectIssueInput.creatorId,
      assigneeId: createProjectIssueInput.assigneeId,
      columnId: createProjectIssueInput.columnID,
      kanbanId: createProjectIssueInput.kanbanID,
      projectId: createProjectIssueInput.projectID,
      createdAt: undefined,
      updatedAt: undefined
    });
    await issue.initID();
    issue.setDetail(
      new ProjectIssueDetail({
        issueId: issue.id,
        content: createProjectIssueInput.content
      })
    );
    // TODO move out repo
    return ProjectIssueRepository.saveIssue(issue);
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

  static async getProjectIssues({ projectId, pageSize, pageNumber }): Promise<PagtiationList<ProjectIssue>> {
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
