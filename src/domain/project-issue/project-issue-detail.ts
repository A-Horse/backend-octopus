import { ProjectIssue } from './project-issue';

export class ProjectIssueDetail {
  public content: string;

  public toJSON(): any {
    return {
      content: this.content
    };
  }
}
