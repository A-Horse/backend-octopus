import express from 'express';
import jwt from 'express-jwt';
import {authJwt} from '../middle/jwt';
import {TaskCard} from '../../model/task-card';
import {TaskWallAccess} from '../../model/Task-wall-access';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const TaskCardRouter = express.Router();

TaskCardRouter.use(authJwt);

TaskCardRouter.get('/task-card', (req, res) => {
  let {jw} = req;
  let {taskWallId} = req.body;
  TaskCard.getModel().where({
    ownerId: jw.user.id,
    taskWallId: taskWallId
  }).fetchAll().then(data => {
    res.status(200).send(data)
  });
});

TaskCardRouter.post('/task-card', (req, res) => {
  validateRequest(req.body, 'title', ['required']);
  validateRequest(req.body, 'taskWallId', ['required']);
  validateRequest(req.body, 'content', ['required']);
  
  const data = R.pick(['title', 'taskWallId', 'ownerId', 'content'], req.body);
  const defaultData = {dimensions: data.dimensions || 'default', category: 'default' || data.category};
  const {jw} = req;
  TaskWallAccess.getModel().where({
    taskWallId: data.taskWallId,
    userId: jw.user.id
  }).fetch().then((access) => {
      if( access ){
        return new TaskCard(Object.assign({}, data, defaultData)).model.save().then(taskWall => {
          return res.status(201).send(taskWall)
        });
      }
      // TODO: throw out handle
      return res.status(401).send({
        message: 'can access this task wall'
      });
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
