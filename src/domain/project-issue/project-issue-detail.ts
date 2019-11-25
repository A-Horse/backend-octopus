import { ProjectIssue } from './project-issue';

export class ProjectIssueDetail {
  public issueId: string;
  public content: string;

  constructor(detailData: any) {
    this.issueId = detailData.issueId;
    this.content = detailData.content;
  }

  public toJSON(): any {
    return {
      issueId: this.issueId,
      content: this.content
    };
  }
}
