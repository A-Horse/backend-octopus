'use strict';

let express = require('express'),
    jwt = require('express-jwt'),
    TaskWallRouter = express.Router();

import {authJwt} from '../middle/jwt';

import {TaskWall} from '../../model/task-wall';
import {TaskCard} from '../../model/task-card';
import {TaskWallAccess} from '../../model/Task-wall-access';

TaskWallRouter.use(authJwt);

TaskWallRouter.get('/task-wall', (req, res, next) => {
  let {jw} = req;
  
  TaskWall.getModel().where({
    ownerId: jw.user.id
  }).fetchAll().then(data => {
    res.send(data)
  });
});

TaskWallRouter.get('/task-wall/:id', (req, res, next) => {
  let {id} = req.params;

  let {jw} = req;
  
  TaskWall.getModel().where({
    id: id
  }).fetch()
    .then(taskWall => {
      if( !taskWall ){
        return res.status(404).send({message: 'task wall not found'});
      }

      if( taskWall.isPublic ){
        TaskCard.getModel().where({
          taskWallId: taskWall.id
        }).fetchAll()
          .then(function(cards){
            return res.send(cards);
          });
        
      } else {

        TaskWallAccess.getModel().where({
          taskWallId: taskWall.id,
          userId: jw.user.id
        }).fetch()
          .then(function(access){

            if( access ){

              TaskCard.getModel().where({
                taskWallId: taskWall.id
              }).fetchAll()
                .then(function(cards){
                  return res.send(cards);
                });
              
            } else {
              return res.status(401).send({
                message: 'cann not access this task wall'
              });
            }
          });
        
      }

    });
  
});

TaskWallRouter.post('/task-wall', (req, res, next) => {
  let {name, isPublic} = req.body;
  
  let {jw} = req;
  
  new TaskWall({
    name,
    ownerId: jw.user.id,
    public: isPublic || false
  }).save().then(taskWall => {
    res.status(201).send(taskWall)
  }).catch(error => {
    console.error(error);
  });
  
});

export {TaskWallRouter};
