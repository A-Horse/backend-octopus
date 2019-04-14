import { TaskBoardShowType, ITaskBoardSetting } from '../../../typing/task-board.typing';

export class TaskBoardSetting {
  public id: string;
  public showType: TaskBoardShowType = TaskBoardShowType.COLUMN;
  public cover: string;

  constructor() {}

  static fromData(data: ITaskBoardSetting) {
    const setting = new TaskBoardSetting();
    setting.id = data.id;
    setting.showType = data.showType;
    setting.cover = data.cover;
    return setting;
  }

  public getValue(): ITaskBoardSetting {
    return {
      id: this.id,
      showType: this.showType,
      cover: this.cover
    };
  }
}
