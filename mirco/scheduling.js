import schedule from 'node-schedule';


const scheduleJob = schedule.scheduleJob('0 * * *', () => {
  console.log('The answer to life, the universe, and everything!');
});
