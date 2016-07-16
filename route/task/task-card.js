'use strict';

let express = require('express'),
    jwt = require('express-jwt'),
    TaskCardRouter = express.Router();

import {authJwt} from '../middle/jwt';

import {TaskCard} from '../../model/task-card';

TaskCardRouter.use(authJwt);

TaskCardRouter.get('/task-card', (req, res, next) => {
  let {jw} = req;
  let {taskWallId} = req.body;
  
  TaskCard.getModel().where({
    ownerId: jw.user.id,
    taskWallId: taskWallId
  }).fetchAll().then(data => {
    res.status(200).send(data)
  });
});

TaskCardRouter.post('/task-card', (req, res, next) => {
  let {name, taskWallId, content} = req.body;
  
  let {jw} = req;
  
  new TaskWall({
    name,
    ownerId: jw.user.id,
    taskWallId: taskWallId,
    content: content
  }).model.save().thaen(taskWall => {
    res.status(201).send(taskWall)
  }).catch(error => {
    console.error(error);
  });
  
});

export {TaskCardRouter};
