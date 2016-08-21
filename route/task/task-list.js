import express from 'express';
import {authJwt} from '../middle/jwt';
import {TaskList} from '../../model/task-list';
import {Group} from '../../model/group';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const TaskListRouter = express.Router();

TaskListRouter.use(authJwt);

TaskListRouter.get('/task-wall/:wallId/list/:listId', (req, res) => {
  const {listId} = this.params;
  TaskList.getModel().where({id: listId}).fetch().then(taskList => {
    if( !taskList ) throw new NotFoundError('not found this task list');
    return res.send(taskList)
  }).catch(error => {throw error});
});

TaskListRouter.post('/task-wall/:wallId/list', (req, res) => {
  validateRequest(req.body, 'name', ['required']);
  const {jw} = req;
  const {wallId} = req.params;
  Group.getModel().where({
    taskWallId: wallId,
    userId: jw.user.id
  }).fetch().then(access => {
    if( !access ) throw new AccessLimitError('can access this task wall');
    new TaskList({taskWallId: wallId, name: req.body.name}).model.save().then(taskList => {
      res.status(201).send()
    });
  })
});

TaskListRouter.patch('/task-wall/:wallId/list/:listId', (req, res) => {
  const {listId} = this.params;
  const info = this.body;
  TaskList.getModel().where({id: listId}).save(info).then(taskList => {
    return res.send(taskList);
  })
});


export {TaskListRouter};
