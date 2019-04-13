import { TaskTrackStatus, ITaskTrack } from "../../typing/task-track.typing";
import { TaskCard } from "../task-card/task-card.domain";
import { TaskCardRepository } from "../../repository/task-card.repository";

export class TaskTrack {
  public id: string;
  public name: string;
  public desc: string;
  public creatorId: number;
  public type: string;
  public status: TaskTrackStatus;
  public createdAt: Date;
  public updatedAt: Date;
  public order: number;

  public cards: TaskCard[];

  constructor() {
  }

  public async load(): Promise<void> {
    if (!this.id) {
        throw new Error('TaskTrack not initial.');
    }
    this.cards = await TaskCardRepository.getCardsByTrackId(this.id);
  }

  public getValue(): ITaskTrack {
    return {
       id: this.id,
       name: this.name,
       desc: this.desc,
       creatorId: this.creatorId,
       type: this.type,
       status: this.status,
       createdAt: this.createdAt,
       updatedAt: this.updatedAt,
       order: this.order
    }
  }
  
  public getValueWithCards(): ITaskTrack {
    if (!this.cards) {
      throw new Error('TaskTrack cards not loaded.');
    }
    return {
      ...this.getValue(),
      cards: this.cards.map(c => c.getValue())
    }
  }
}
