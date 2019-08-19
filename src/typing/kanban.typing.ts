export type KanbanId = string;

export enum KanbanStatus {
  ACTIVE = 'ACTIVE'
}

export enum KanbanType {
  NORMAL = 'NORMAL'
}

export interface CreateKanbanInput {
  name: string;
  creatorId: number;
  projectId: string;
  desc?: string;
}
