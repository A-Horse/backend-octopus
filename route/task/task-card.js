'use strict';

let express = require('express'),
    jwt = require('express-jwt'),
    TaskCardRouter = express.Router();

import {authJwt} from '../middle/jwt';

import {TaskCard} from '../../model/task-card';
import {TaskWallAccess} from '../../model/Task-wall-access';

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
  let {title, taskWallId, ownerId, content} = req.body;
  
  let {jw} = req;

  console.log(req.body);
  
  TaskWallAccess.getModel().where({
    taskWallId: taskWallId,
    userId: jw.user.id
  }).fetch()
    .then(function(access){

      if( access ){
        new TaskCard({
          title,
          createrId: jw.user.id,
          taskWallId: taskWallId,
          //ownerId: ownerId || 1,
          content: content
        }).model.save().then(taskWall => {
          return res.status(201).send(taskWall)
        }).catch(error => {
          console.error(error);
        });
        
      } else {
        return res.status(401).send({
          message: 'can access this task wall'
        });
      }
    });  
});

TaskCardRouter.patch('/task-card', (req, res, next) => {
  let {status, id} = req.body;

  //TODO check status name
  new TaskCard({
    id
  }).model.fetch().then((card) => {
    if( !card ){
      return res.status(400).send({message: 'can not found task-card'});
    }
    return new Promise(resovle => resovle(card));
  }).then(card => {
    
    
    
  });
  
  
});

export {TaskCardRouter};
