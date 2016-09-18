import express from 'express';
import morgan from 'morgan';
import http from 'http';
import {apiPrefix} from './constant';

const app = express();

app.set('view engine', 'ejs');
app.set('views', '../views');
app.use('/static', express.static('../static'));
app.use(morgan('combined'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());

import {UserRouter} from './route/user.js';
import {TaskWallRouter} from './route/task/task-wall';
import {TaskListRouter} from './route/task/task-list';
import {TaskCardRouter} from './route/task/task-card';
import {GoalListRouter} from './route/goal/list';
import {IdeaListRouter} from './route/idea/list';
import {StatusErrorHandleMiddle} from './route/middle/error-handle';

app.use(apiPrefix, UserRouter);
app.use(apiPrefix, TaskWallRouter);
app.use(apiPrefix, TaskListRouter);
app.use(apiPrefix, TaskCardRouter);
app.use(apiPrefix, GoalListRouter);
app.use(apiPrefix, IdeaListRouter);
app.use(StatusErrorHandleMiddle);

function startServer() {
  const server = http.createServer(app);
  server.listen(5500);
}

startServer();
