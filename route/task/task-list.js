import express from 'express';
import {authJwt} from '../middle/jwt';
import {TaskList, TaskListModel} from '../../model/task-list';
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
  }).fetch().then(async (access) => {
    if( !access ) throw new AccessLimitError('can access this task wall');

    const existNumber = await TaskListModel.where({taskWallId: wallId}).count();
    new TaskList({taskWallId: wallId, name: req.body.name}).model.save({index: existNumber}).then(taskList => {
      res.status(201).send()
    });
  })
});

TaskListRouter.patch('/task-wall/:boardId/track', async (req, res) => {
  const {boardId} = req.params;
  const {trackIndexs} = req.body;

  trackIndexs.forEach(trackIndex => {
    TaskListModel.where({id: trackIndex.id}).save({index: trackIndex.index});
  });
  
});

TaskListRouter.patch('/task-board/:wallId/list/:listId', async (req, res) => {
  const {listId} = req.params;
  const info = req.body;
  // TODO 检查是否存在
  const track = await new TaskListModel({id: listId}).fetch();
  if (!track) throw new NotFoundError('can not found this task track');
  const newTrack = track.save(info);
  return res.send(newTrack);
});

TaskListRouter.delete('/task-wall/:wallId/list/:listId', (req, res) => {
  const {wallId, listId} = req.params;
  const {jw} = req;
  Group.getModel().where({taskWallId: wallId, userId: jw.user.id}).fetch()
    .then(access => {
      if (!access) throw new AccessLimitError('can access this task wall');
      new TaskListModel({id: listId}).bundleDelete().then(() => {
        res.status(201).send();
      }).catch(error => {throw error});
    });
});

export {TaskListRouter};
