import * as express from 'express';
import * as Ascii from 'ascii-art';
import * as morgan from 'morgan';
import * as http from 'http';
import * as colors from 'colors';

import { apiPrefix } from './constant';

import config from './service/config';

const app = express();

app.set('view engine', 'ejs');
app.use('/storage', express.static('storage'));
app.use(morgan('dev'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')());

import { RootRouter } from './route/root';
import { TaskTrackRouter } from './route/task/task-track.router';
import { TaskCardRouter } from './route/task/task-card.router';
import { FileRouter } from './route/file';
import { StatusErrorHandleMiddle } from './route/middle/error-handle';

import { tApiPrefix } from './constant';
import { TodoBoxRouter } from './route/todo/todo-box';
import { TodoRouter } from './route/todo/todo.router';
import { TaskBoardRouter } from './route/task/task-board.router';
import { UserRouter } from './route/user.router';

app.use(apiPrefix, FileRouter);
app.use(apiPrefix, RootRouter);
app.use(apiPrefix, TaskTrackRouter);
app.use(apiPrefix, TaskCardRouter);

app.use(tApiPrefix, TodoBoxRouter);
app.use(tApiPrefix, TodoRouter);
app.use('/api/tk', TaskBoardRouter);
app.use('/api/user', UserRouter);

app.use(StatusErrorHandleMiddle);

function startServer() {
  const server = http.createServer(app);
  server.listen(config['SERVE_PORT'], '0.0.0.0');

  Ascii.font(`Octopus`, 'Doom', 'bright_blue', ascii => {
    // tslint:disable-next-line
    console.log(ascii);
    // tslint:disable-next-line
    console.log(colors.green(`Octopus serve on http://127.0.0.1:5500`));
  });
}

startServer();
