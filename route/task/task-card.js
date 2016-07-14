'use strict';

let express = require('express'),
    jwt = require('express-jwt'),
    TaskCardRouter = express.Router();

import {authJwt} from '../middle/jwt';

import {TaskCard} from '../../model/task-card';

TaskCardRouter.use(authJwt);

TaskCardRouter.get('/task-card', (req, res, next) => {
  let {jw} = req;
  TaskWall.getModel().where({
    ownerId: jw.user.id
  }).fetchAll().then(data => {
    res.status(200).send(data)
  });
});

TaskCardRouter.post('/task-card', (req, res, next) => {
  let {name} = req.body;
  
  let {jw} = req;
  
  new TaskWall({
    name,
    ownerId: jw.user.id
  }).model.save().then(taskWall => {
    res.status(201).send(taskWall)
  }).catch(error => {
    console.error(error);
  });
  
});

export {TaskCardRouter};
