import { TaskBoardShowType } from '../../../typing/task-board.typing';

export class TaskBoardSetting {
  public id: string;
  public showType: string = TaskBoardShowType.COLUMN;
  public createdAt: Date;
  public updatedAt: Date;

  constructor() {}
}
