import schedule from 'node-schedule';
import { TodoModel } from '../model/todo';
import { TodoRepeatModel } from '../model/todo-repeat';
import moment from 'moment';
import R from 'ramda';
import { scheduleLogger } from '../log';
import { todoEveryDayBegin } from '../schedule/todo';

const scheduleJob = schedule.scheduleJob('0 * * *', () => {
  scheduleLogger.info('schedule', new moment().format('YYYY-MM-DD'));

  todoEveryDayBegin();
});

todoEveryDayBegin();
