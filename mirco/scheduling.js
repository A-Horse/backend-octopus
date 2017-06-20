import schedule from 'node-schedule';
import { TodoModel } from '../model/todo';
import { TodoRepeatModel } from '../model/todo-repeat';
import moment from 'moment';
import R from 'ramda';
import { scheduleLogger } from '../log';
console.log("scheduleLogger = ", scheduleLogger);

const scheduleJob = schedule.scheduleJob('0 * * *', () => {
  console.log('start schedule', new moment());

  processTodoRepeat();
});

function filterTodo(todo) {
  return Math.ceil((-todo.get('created_at') + new Date('2017-6-21').getTime()) / (60 * 60 * 24 * 1000)) % todo.get('repeat') === 0;
}

async function processTodoRepeat() {
  try {
    const todos = await TodoModel.query(
      'where', 'repeat', '!=', 'null'
    ).fetchAll();
    const filteredTodos = todos.filter(filterTodo);
    await Promise.all(filteredTodos.map(async (todo) => {
      scheduleLogger.info('todo id', todo.id, 'backlog to repeat table.')
      new TodoRepeatModel({
        todoId: todo.id,
        isDone: todo.get('isDone'),
        doneTime: todo.get('doneTime'),
        created_at: new Date().getTime()
      }).save();
      await todo.save({
        isDone: null,
        doneTime: null
      });
    }));
  } catch (error) {
    console.error(error);
  }
};

processTodoRepeat();
