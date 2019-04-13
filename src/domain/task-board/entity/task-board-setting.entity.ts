import { TaskBoardShowType, ITaskBoardSetting } from '../../../typing/task-board.typing';

export class TaskBoardSetting {
  public id: string;
  public showType: TaskBoardShowType = TaskBoardShowType.COLUMN;
  public createdAt: Date;
  public updatedAt: Date;

  constructor() {}

  public getValue(): ITaskBoardSetting {
    return {
      id: this.id,
      showType: this.showType
    };
  }
}
