import { ITaskTrack } from './task-track.typing';

export enum TaskBoardStatus {
  ACTIVE = 'ACTIVE',
  DONE = 'DONE'
}

export enum TaskBoardShowType {
  COLUMN = 'COLUMN',
  LIST = 'LIST'
}

export interface ITaskBoardSetting {
  id: string;
  showType: TaskBoardShowType;
  cover: string;
}

export interface ITaskBoard {
  id: string;
  name: string;
  desc: string;
  creatorId: number;
  setting: ITaskBoardSetting;
  tracks?: ITaskTrack[];
}
