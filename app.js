'use strict';

let express = require('express'),
    morgan = require('morgan'),
    http = require('http');


let app = express(),
    setting = require('./setting');


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
app.use('/api', UserRouter);

import {TaskWallRouter} from './route/task/task-wall';
app.use('/api', TaskWallRouter);


function startHttp() {
  let server = http.createServer(app);
  server.listen(5000);
}

startHttp();
