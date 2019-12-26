import { createTodo } from '../domain/todo/createTodo';
import { getUserDefaultTodos } from '../domain/todo/getTodos';
import { ITodoDetail, TodoDetailDomain } from '../domain/todo/todo-detail';
import { Todo } from '../orm/todo.entity';

class TodoService {
  constructor() {}

  public async getUserDefaultTodos({ userId, limit, offset }): Promise<Todo[]> {
    return await getUserDefaultTodos({ userId, limit, offset });
  }

  public async createTodo({ userId, content, deadline, boxId }): Promise<string> {
    return await createTodo({
      userId,
      content
    });
  }

  public async updateTodoDetail(detail: ITodoDetail): Promise<void> {
    const detailDomain = new TodoDetailDomain(detail.id);
    await detailDomain.updateDetail(detail);
  }
}

export const todoService = new TodoService();
