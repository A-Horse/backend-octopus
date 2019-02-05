import { UserModel } from '../model/user';
import { User } from '../entity/user.entity';
import { getRepository } from 'typeorm';
import { TodoModel } from '../model/todo.model';
import { Todo } from '../entity/todo.entity';

export async function migrationUser() {
  const users = await new UserModel().fetchAll();
  users.forEach(async (user: UserModel) => {
    const newUser = new User();

    newUser.id = user.get('id');
    newUser.hash = user.get('password');
    newUser.email = user.get('email');
    newUser.username = user.get('username');

    await getRepository(User).save(newUser);
  });
}

export async function migrationTodo() {
  const todos = await new TodoModel().fetchAll();

  todos
    .filter(todo => todo.get('content'))
    .forEach(async (todo: UserModel) => {
      const newTodo = new Todo();

      const creator = new User();
      creator.id = todo.get('userId');

      newTodo.creator = creator;

      newTodo.content = todo.get('content');
      newTodo.deadline = todo.get('deadline') ? new Date(todo.get('deadline')) : undefined;
      newTodo.status = todo.get('isDone') ? 'DONE' : 'ACTIVE';
      newTodo.isDelete = todo.get('isDelete') ? true : false;

      await getRepository(Todo).save(newTodo);
    });
}
