export type KanbanColumnId = string;

export interface CreateKanbanColumnInput {
  name: string;
  creatorId: number;
  kanbanId: string;
}

export enum KanbanColumnStatus {
  ACTIVE = 'ACTIVE'
}
