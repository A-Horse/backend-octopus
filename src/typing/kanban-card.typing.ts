export enum ProjectIssueType {
  NORMAL = 'NORMAL',
  STORY = 'STORY',
  TODO = 'TODO'
}

export interface CreateProjectIssueInput {
  title: string;
  content?: string;
  type: ProjectIssueType | null;
  creatorId: number;
  kanbanID?: string;
  columnID?: string;
  projectID: string;
  assigneeId: number;
}
