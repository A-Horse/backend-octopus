import express from 'express';
import morgan from 'morgan';
import http from 'http';
import { tApiPrefix } from '../constant';

const app = express();

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('cookie-parser')());

import { TodoBoxRouter } from '../route/todo/todo-box';
import { StatusErrorHandleMiddle } from '../route/middle/error-handle';
import { AliveRouter } from '../route/share/alive';

app.use(AliveRouter);
app.use(tApiPrefix, TodoBoxRouter);
app.use(StatusErrorHandleMiddle);

const server = http.createServer(app);
server.listen(5502, '0.0.0.0');
