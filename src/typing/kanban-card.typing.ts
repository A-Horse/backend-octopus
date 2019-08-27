export enum KanbanCardType {
  NORMAL = 'NORMAL',
  STORY = 'STORY',
  TODO = 'TODO'
}

export interface CreateProjectCardInput {
  title: string;
  content: string;
  type: KanbanCardType |null;
  creatorId: number;
  assigneeId: number;
  columnId: string;
}
