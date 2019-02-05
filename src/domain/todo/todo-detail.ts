import { ITodo, Todo } from '../../entity/todo.entity';
import { getRepository } from 'typeorm';

export interface ITodoDetail extends ITodo {}

export class TodoDetailDomain {
  static getDetail() {}

  constructor(public id: string) {}

  public async updateDetail(detail: ITodoDetail): Promise<void> {
    const todoEntity = new Todo();

    if (detail.status !== 'DONE' && detail.status !== 'ACTIVE') {
      throw new Error('Todo status is invalid.');
    }

    todoEntity.id = this.id;
    todoEntity.content = detail.content;
    todoEntity.desc = detail.desc;
    todoEntity.status = detail.status;

    await getRepository(Todo).update(this.id, todoEntity);
  }
}
