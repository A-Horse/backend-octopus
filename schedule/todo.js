import { TodoModel } from '../model/todo';
import { TodoRepeatModel } from '../model/todo-repeat';
import moment from 'moment';
import R from 'ramda';
import { TdScheduleLogger } from '../log';

function filterTodo(todo) {
  return Math.ceil((-todo.get('created_at') + new Date('2017-6-21').getTime()) / (60 * 60 * 24 * 1000)) % todo.get('repeat') === 0;
}

export async function processTodoRepeat() {
  try {
    TdScheduleLogger.info('todo schedule', 'start');
    const todos = await TodoModel.query(
      'where', 'repeat', '!=', 'null'
    ).fetchAll();
    const filteredTodos = todos.filter(filterTodo);
    await Promise.all(filteredTodos.map(async (todo) => {

      const todoRepeat = await new TodoRepeatModel({
        todoId: todo.id,
        isDone: todo.get('isDone'),
        doneTime: todo.get('doneTime'),
        created_at: new Date().getTime()
      }).save();

      TdScheduleLogger.info('todo-repeat', 'todo repeat id', todoRepeat.id, 'backlog to repeat table.', todoRepeat.toJSON());
      await todo.save({
        isDone: null,
        doneTime: null
      });
      TdScheduleLogger.info('todo', 'todo id', todo.id, 'backlog to repeat table.', todo.toJSON());
      return Promise.resolve();
    }));
    TdScheduleLogger.info('todo schedule', 'stop');
  } catch (error) {
    TdScheduleLogger.error('todo schedule', error);
  }
};

export function handleTodoWhenEveryDayBegin() {
  processTodoRepeat();
}
