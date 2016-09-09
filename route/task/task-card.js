import express from 'express';
import {authJwt} from '../middle/jwt';
import {TaskCard} from '../../model/task-card';
import {TaskList} from '../../model/task-list';
import {Group} from '../../model/group';
import {AccessLimitError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const TaskCardRouter = express.Router();

TaskCardRouter.use(authJwt);

TaskCardRouter.get('/task-card', (req, res) => {
  const {jw} = req;
  const {taskWallId} = req.body;
  TaskCard.getModel().where({
    ownerId: jw.user.id,
    taskWallId: taskWallId
  }).fetchAll().then(data => {
    res.status(200).send(data)
  });
});

TaskCardRouter.delete('/task-card/:id', (req, res) => {
  const {id} = req.params;
  TaskCard.getTaskCard({id})
    .destroy()
    .then(() => {
      res.status(200).send()
    })
    .catch(error => {
      throw error;
    })
});

TaskCardRouter.post('/task-card', (req, res, next) => {
  validateRequest(req.body, 'title', ['required']);
  validateRequest(req.body, 'taskWallId', ['required']);
  validateRequest(req.body, 'taskListId', ['required']);
  
  const data = R.pick(['title', 'taskWallId', 'taskListId'], req.body);
  const {jw} = req;
  Group.getModel().where({
    taskWallId: data.taskWallId,
    userId: jw.user.id
  }).fetch().then((access) => {
    if( !access ) throw new AccessLimitError('can access this task wall');
    new TaskCard(Object.assign({}, data, {createrId: jw.user.id})).model.save().then(taskCard => {
      res.status(201).send(taskCard);
    });
  }).catch(error => next(error));
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
