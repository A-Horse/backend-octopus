import { ProjectIssue } from '../project-issue';

export function setPartialIssueData(projectIssue: ProjectIssue, partialIssueData: any): void {
  Object.keys(partialIssueData).forEach((key: string) => {
    projectIssue[key] = partialIssueData[key];
  });
}
