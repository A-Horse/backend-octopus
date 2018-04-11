import * as express from 'express';
import * as morgan from 'morgan';
import * as http from 'http';

import { apiPrefix } from './constant';

const app = express();

app.set('view engine', 'ejs');
app.use('/storage', express.static('storage'));
app.use(morgan('dev'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')());

import { RootRouter } from './route/root';
import { TaskListRouter } from './route/task/task-list';
import { TaskCardRouter } from './route/task/task-card';
import { FileRouter } from './route/file';
import { StatusErrorHandleMiddle } from './route/middle/error-handle';

import { tApiPrefix } from './constant';
import { TodoBoxRouter } from './route/todo/todo-box';
import { TodoRouter } from './route/todo/todo.router';
import { TaskBoardRouter } from './route/task/task-board.router';
import { UserRouter } from './route/user.router';

import * as colors from 'colors';
import * as Ascii from 'ascii-art';

// app.use(apiPrefix, UserRouter);
app.use(apiPrefix, FileRouter);
app.use(apiPrefix, RootRouter);
app.use(apiPrefix, TaskListRouter);
app.use(apiPrefix, TaskCardRouter);

app.use(tApiPrefix, TodoBoxRouter);
app.use(tApiPrefix, TodoRouter);
app.use('/api/tk', TaskBoardRouter);
app.use('/api/user', UserRouter);

// app.use(apiPrefix, TodoListRouter);
app.use(StatusErrorHandleMiddle);

function startServer() {
  const server = http.createServer(app);
  server.listen(5500, '0.0.0.0');

  Ascii.font(`Octopus`, 'Doom', 'bright_blue', ascii => {
    console.log(ascii);
    console.log(colors.green(`Octopus serve on http://127.0.0.1:5500`));
  });
}

startServer();
