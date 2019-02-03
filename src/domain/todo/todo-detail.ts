import { ITodo, Todo } from '../../entity/todo.entity';
import { getRepository } from 'typeorm';

export interface ITodoDetail extends ITodo {}

export class TodoDetailDomain {
  static getDetail() {}

  constructor(public id: string) {}

  public async updateDetail(detail: ITodoDetail): Promise<void> {
    const todoEntity = new Todo();
    todoEntity.id = this.id;
    todoEntity.content = detail.content;
    todoEntity.desc= detail.content;
    todoEntity.status = detail.status;
    
    await getRepository(Todo).update(this.id, todoEntity);
  }
}
