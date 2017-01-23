import express from 'express';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import {apiPrefix} from './constant';
import config from './service/config';

const app = express();

app.set('view engine', 'ejs');
app.set('views', '../views');
app.use('/static', express.static('../static'));
app.use(cors());
app.use(morgan('combined'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());

import {UserRouter} from './route/user.js';
import {RootRouter} from './route/root.js';
import {TaskWallRouter} from './route/task/task-wall';
import {TaskListRouter} from './route/task/task-list';
import {TaskCardRouter} from './route/task/task-card';
import {GoalListRouter} from './route/goal/list';
import {IdeaListRouter} from './route/idea/list';
import {TodoListRouter} from './route/todo/list';
import {FileRouter} from './route/file';
import {StatusErrorHandleMiddle} from './route/middle/error-handle';

app.use(apiPrefix, UserRouter);
app.use(apiPrefix, FileRouter);
app.use(apiPrefix, RootRouter);
app.use(apiPrefix, TaskWallRouter);
app.use(apiPrefix, TaskListRouter);
app.use(apiPrefix, TaskCardRouter);
app.use(apiPrefix, GoalListRouter);
app.use(apiPrefix, IdeaListRouter);
app.use(apiPrefix, TodoListRouter);
app.use(StatusErrorHandleMiddle);

function startServer() {
  const server = http.createServer(app);
  server.listen(config.getServerPort());
}

startServer();
