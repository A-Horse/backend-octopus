import express from 'express';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';

import config from '../service/config';
import { apiPrefix } from '../constant';

const app = express();

app.set('view engine', 'ejs');
app.use('/storage', express.static('storage'));
// app.use(cors());
app.use(morgan('combined'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());

import { UserRouter } from '../route/user.js';
import { RootRouter } from '../route/root.js';
import { TaskListRouter } from '../route/task/task-list';
import { TaskCardRouter } from '../route/task/task-card';
import { IdeaListRouter } from '../route/idea/list';
import { TodoListRouter } from '../route/todo/list';
import { FileRouter } from '../route/file';
import { StatusErrorHandleMiddle } from '../route/middle/error-handle';

app.use(apiPrefix, UserRouter);
app.use(apiPrefix, FileRouter);
app.use(apiPrefix, RootRouter);
app.use(apiPrefix, TaskListRouter);
app.use(apiPrefix, TaskCardRouter);
app.use(apiPrefix, IdeaListRouter);
app.use(apiPrefix, TodoListRouter);
app.use(StatusErrorHandleMiddle);

function startServer() {
  const server = http.createServer(app);
  server.listen(5500, '0.0.0.0');
}

startServer();
