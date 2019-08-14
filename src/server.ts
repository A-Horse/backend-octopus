import * as express from 'express';
import * as morgan from 'morgan';
import * as http from 'http';
import * as colors from 'colors';
import * as path from 'path';
import * as fs from 'fs';
import rfs from 'rotating-file-stream';

import { apiPrefix } from './constant';
import config from './service/config';

const app = express();

const logDirectory = path.join(__dirname, '../log/access');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
});

app.set('view engine', 'ejs');
app.use(
  '/storage',
  express.static('storage', {
    maxAge: 1000 * 60 * 60 * 24 * 365
  })
);

app.use(morgan('combined'));
app.use(morgan('combined', { stream: accessLogStream }));

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')());

import { RootRouter } from './route/root';
import { TaskTrackRouter } from './route/task/task-track.router';
import { TaskCardRouter } from './route/task/task-card.router';
import { StatusErrorHandleMiddle } from './route/middle/error-handle';

import { tApiPrefix } from './constant';
import { TodoBoxRouter } from './route/todo/todo-box';
import { TodoRouter } from './route/todo/todo.router';
import { TaskBoardRouter } from './route/task/task-board.router';

import { UserRouter } from './route/user.router';
import { TaskBoardSettingRouter } from './route/task/task-board-setting.router';
import { ProjectRouter } from './domain/project/project-router';
import { KanbanRouter } from './domain/kanban/kanban-router';

app.use(RootRouter);
app.use(apiPrefix, TaskTrackRouter);
app.use(apiPrefix, TaskCardRouter);

app.use(tApiPrefix, TodoBoxRouter);
app.use(tApiPrefix, TodoRouter);
app.use(apiPrefix, TaskBoardSettingRouter);
app.use('/api/tk', TaskBoardRouter);
app.use('/api/user', UserRouter);

app.use(apiPrefix, ProjectRouter);
app.use(apiPrefix, KanbanRouter);

app.use(StatusErrorHandleMiddle);

export function startServer() {
  const server = http.createServer(app);
  server.listen(config['SERVE_PORT'], '0.0.0.0');

  console.log(colors.green(`Octopus serve on http://0.0.0.0:5500`));
}
