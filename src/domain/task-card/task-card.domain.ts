import { ITaskCard, TaskCardType } from '../../typing/task-card.typing';
import { TaskCardRepository } from '../../repository/task-card.repository';

export class TaskCard {
  public id: string;
  public title: string;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;
  public status: string;
  public type: TaskCardType;
  public order: number;
  public trackId: string;

  public getValue(): ITaskCard {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status,
      type: this.type,
      order: this.order
    };
  }

  public async queryAndSetOrder(): Promise<void> {
    if (!this.trackId) {
      throw new Error('TaskCard trackId not initial.');
    }
    this.order = (await TaskCardRepository.getCardCountInTrack(this.trackId)) * 100;
  }
}
