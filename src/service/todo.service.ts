import { Todo } from "../entity/todo.entity";
import { getUserDefaultTodos } from "../domain/todo/getTodos";
import { createTodo } from "../domain/todo/createTodo";
import { TodoDetailDomain, ITodoDetail } from "src/domain/todo/todo-detail";

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

  public async updateTodoDetail(detail: ITodoDetail): Promise<void> {
    const detailDomain = new TodoDetailDomain(detail.id);
    await detailDomain.updateDetail(detail);
  }
}

export const todoService = new TodoService();