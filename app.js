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
import {PageRouter} from './route/page.js';
import {PageViewRouter} from './route/page-view.js';
app.use('/api', UserRouter);
app.use('/api', PageRouter);
app.use('/', PageViewRouter);


function startHttp() {
  let server = http.createServer(app);
  server.listen(5000);
}

startHttp();
