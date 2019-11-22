import { ProjectIssue } from './project-issue';

export class ProjectIssueDetail {
  public issueId: string;
  public content: string;

  constructor({issueId}) {
    this.issueId = issueId;
  }

  public toJSON(): any {
    return {
      issueId: this.issueId,
      content: this.content
    };
  }
}
