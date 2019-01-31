import { Todo } from "../entity/todo.entity";
import { getUserDefaultTodos } from "../domain/todo/getTodos";
import { createTodo } from "../domain/todo/createTodo";

class TodoService {
  constructor() {}

  public async getUserDefaultTodos({userId, limit, offset}): Promise<Todo[]> {
    return await getUserDefaultTodos({userId, limit, offset});
  }

  public async createTodo({userId, content, deadline, boxId}): Promise<string> {
    return await createTodo({
      userId,
      content
    })
  }
}

export const todoService = new TodoService();