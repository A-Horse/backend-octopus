import { TaskBoardSetting } from './entity/task-board-setting.entity';
import { TaskTrack } from '../task-track/task-track.domain';
import { TaskTrackRepository } from '../../repository/task-track.repository';
import { ITaskBoard } from '../../typing/task-board.typing';

export class TaskBoard {
  public id: string;
  public name: string;
  public desc: string;
  public creatorId: number;
  public setting: TaskBoardSetting;

  public tracks: TaskTrack[];

  constructor() {
    this.loadTracks().then();
  }

  public async loadTracks(): Promise<void> {
    if (!this.id) {
      throw Error('TaskBoard not initial.')
    }
    this.tracks = await TaskTrackRepository.getTracks(this.id);
  }

  public getValue(): ITaskBoard {
    return {
      id: this.id,
  name: this.name,
  desc: this.desc,
  creatorId: this.creatorId,
  setting: this.setting.getValue()
    }
  }
  
}
