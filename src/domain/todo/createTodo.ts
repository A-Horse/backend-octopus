import { Todo } from '../../entity/todo.entity';
import { getRepository } from 'typeorm';

export function createTodo({ userId, title, content }): Promise<Todo> {
  const todo = new Todo();
  todo.content = content;

  return getRepository(Todo).save(todo);
}
