import { ITaskCard } from '../../typing/task-card.typing';

export class TaskCard {
  public id: string;
  public title: string;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;
  public status: string;
  public type: string;
  public order: number;

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
}
