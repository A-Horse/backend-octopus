import { TaskTrackStatus } from "../../typing/task-track.typing";

export class TaskTrack {
  public id: string;
  public name: string;
  public desc: string;
  public creatorId: number;
  public status: TaskTrackStatus;
  public createdAt: Date;
  public updatedAt: Date;

  constructor() {}
}
