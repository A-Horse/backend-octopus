export enum TaskCardType {
  NORMAL = 'NORMAL',
  STORY = 'STORY',
  TODO = 'TODO'
}

export interface ITaskCard {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  type: string;
  order: number;
}

export interface CreateTaskCardInput {
  title: string;
  boardId: string;
  trackId: string;
  type: TaskCardType;
  creatorId: number;
}
