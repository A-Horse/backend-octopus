import { TaskBoardSetting } from './entity/task-board-setting.entity';
import { TaskTrack } from '../task-track/task-track.domain';
import { TaskTrackRepository } from '../../repository/task-track.repository';
import { ITaskBoard, ITaskBoardSetting } from '../../typing/task-board.typing';
import { TaskBoardRepository } from '../../repository/task-board.repository';

export class TaskBoard {
  public id: string;
  public name: string;
  public desc: string;
  public creatorId: number;
  public setting: TaskBoardSetting;

  public tracks: TaskTrack[];

  constructor() {}

  public async load(): Promise<void> {
    if (!this.id) {
      throw Error('TaskBoard not initial.');
    }
    this.tracks = await TaskTrackRepository.getTracks(this.id);
    await Promise.all(this.tracks.map(t => t.load()));
  }

  public getSettingValue(): ITaskBoardSetting {
    return this.setting.getValue();
  }

  public getValue(): ITaskBoard {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      creatorId: this.creatorId,
      setting: this.setting.getValue()
    };
  }

  public async setBoardCover(filename: string): Promise<void> {
    this.setting.cover = filename;

    await this.udpateSetting();
  }

  public udpateSetting(): Promise<void> {
    return TaskBoardRepository.updateBoardSetting(this.setting);
  }

  public getValueWithAllData(): ITaskBoard {
    if (!this.tracks) {
      throw new Error('TaskBoard track not loaded');
    }
    return {
      ...this.getValue(),
      tracks: this.tracks.map(t => t.getValueWithCards())
    };
  }
}
