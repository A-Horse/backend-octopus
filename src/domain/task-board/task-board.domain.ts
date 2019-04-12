import { TaskBoardSetting } from './entity/task-board-setting.entity';

export class TaskBoard {
  public id: string;
  public name: string;
  public desc: string;
  public creatorId: number;
  public setting: TaskBoardSetting;

  constructor() {}
}
