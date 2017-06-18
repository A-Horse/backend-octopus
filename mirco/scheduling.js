import schedule from 'node-schedule';
import { TodoModel } from '../model/todo';

const scheduleJob = schedule.scheduleJob('0 * * *', () => {
  console.log('The answer to life, the universe, and everything!');


});


const xx = function() {
  TodoModel.where()
};
