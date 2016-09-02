import express from 'express';
import morgan from 'morgan';
import http from 'http';

const app = express();

app.set('view engine', 'ejs');
app.set('views', '../views');
app.use('/static',  express.static('../static'));
app.use(morgan('combined'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({
  extended: true
}));
app.use(require('cookie-parser')());

import {UserRouter} from './route/user.js';
import {TaskWallRouter} from './route/task/task-wall';
import {TaskListRouter} from './route/task/task-list';
import {TaskCardRouter} from './route/task/task-card';
import {StatusErrorHandleMiddle} from './route/middle/error-handle';

app.use('/api', UserRouter);
app.use('/api', TaskWallRouter);
app.use('/api', TaskListRouter);
app.use('/api', TaskCardRouter);
app.use(StatusErrorHandleMiddle);

function startServer() {
  const server = http.createServer(app);
  server.listen(5500);
}

startServer();
