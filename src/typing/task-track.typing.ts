import { ITaskCard } from './task-card.typing';

export enum TaskTrackStatus {
  ACTIVE = 'ACTIVE',
  DONE = 'DONE'
}

export interface ITaskTrack {
  id: string;
  name: string;
  desc: string;
  creatorId: number;
  type: string;
  status: TaskTrackStatus;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  cards?: ITaskCard[];
}

export interface CreateTrackInput {
  name: string;
  desc?: string;
  creatorId: number;
  boardId: string;
}
