import { TodoModel } from '../model/todo';
import { TodoRepeatModel } from '../model/todo-repeat';
import moment from 'moment';
import R from 'ramda';
import { scheduleLogger } from '../log';

function filterTodo(todo) {
  return Math.ceil((-todo.get('created_at') + new Date('2017-6-21').getTime()) / (60 * 60 * 24 * 1000)) % todo.get('repeat') === 0;
}

export async function processTodoRepeat() {
  try {
    scheduleLogger.info('todo schedule', 'start');
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

      scheduleLogger.info('todo-repeat', 'todo repeat id', todoRepeat.id, 'backlog to repeat table.', todoRepeat.toJSON());
      await todo.save({
        isDone: null,
        doneTime: null
      });
      scheduleLogger.info('todo', 'todo id', todo.id, 'backlog to repeat table.', todo.toJSON());
      return Promise.resolve();
    }));
    scheduleLogger.info('todo schedule', 'stop');
  } catch (error) {
    scheduleLogger.error('todo schedule', error);
  }
};

export function todoEveryDayBegin() {
  processTodoRepeat();
}
