import express from 'express';
import morgan from 'morgan';
import http from 'http';
import config from '../service/config';
import { tsApiPrefix } from '../constant';
import schedule from 'node-schedule';
import { TdScheduleLogger } from '../log';
import { handleTodoWhenEveryDayBegin } from '../schedule/todo';

const app = express();

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')());

import { TodoStatisticsRouter } from '../route/todo/todo-statistics';
import { StatusErrorHandleMiddle } from '../route/middle/error-handle';
import { AliveRouter } from '../route/share/alive';

app.use(AliveRouter);
app.use(tsApiPrefix, TodoStatisticsRouter);
app.use(StatusErrorHandleMiddle);

schedule.scheduleJob('0 0 4 * * *', () => {
  TdScheduleLogger.info('start todo statistics schedule.');
  handleTodoWhenEveryDayBegin();
});

const server = http.createServer(app);
server.listen(5501, '0.0.0.0');
