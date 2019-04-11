import { Todo } from '../../entity/todo.entity';
import { getRepository } from 'typeorm';
import { UserEntity } from '../../entity/user.entity';

export async function createTodo({ userId, content }): Promise<string> {
  const todo = new Todo();

  const creator = new UserEntity();
  creator.id = userId;

  todo.content = content;
  todo.creator = creator;

  const id = (await getRepository(Todo).save(todo)).id;
  return id;
}
