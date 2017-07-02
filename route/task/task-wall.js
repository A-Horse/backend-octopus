import {bookshelf} from '../../db/bookshelf.js';
import express from 'express';
import {authJwt} from '../middle/jwt';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {TaskWall, TaskBoardModel, TASKWALL_TYPE} from '../../model/task-wall';
import {TaskCard, TaskCardModel} from '../../model/task-card';
import {TaskList, TaskListModel} from '../../model/task-list';
import {Group} from '../../model/group';
import R from 'ramda';
import {hashFileName} from '../../service/file';
import path from 'path';
import {saveImage} from '../../service/storage';

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const TaskWallRouter = express.Router();
TaskWallRouter.use(authJwt);

TaskWallRouter.get('/tk/user/:userId/task-board', (req, res, next) => {
  const { jw } = req;
  TaskWall.getModel().where({
    ownerId: jw.user.id
  }).fetchAll().then(data => res.send(data));
});

TaskWallRouter.delete('/task-wall/:id', async (req, res, next) => {
  const {id} = req.params;
  await TaskBoardModel.where({id: id}).destroy();
  const tracks = await TaskListModel.where({taskWallId: id}).fetchAll();
  // TODO SQL delete
  tracks.forEach(async (track) => {
    await TaskCardModel.where({taskListId: track.id}).destroy();
    await track.destroy();
  });
  res.status(204).send();
});

// TODO :wallId/verbose
TaskWallRouter.get('/user/:userId/task-wall/:wallId/all', async (req, res, next) => {
  const {wallId} = req.params;
  const {jw} = req;

  const board = await TaskWall.getModel().where({id: wallId}).fetch({withRelated: [{
    'tracks': function() {},
    'tracks.cards': function() {},
    'tracks.cards.creater': function(qb) {
      qb.select('email', 'id')
    },
    'tracks.cards.owner': function(qb) {
      qb.select('email', 'id')
    }
  }]});
  if (!board) return next(new NotFoundError());

  //TODO refactor!!!!!!!!!!!!!
  return Group.getModel().where({
    taskWallId: board.id,
    userId: jw.user.id
  }).fetch().then(access => {
    if (!access) throw new AccessLimitError();
    return Promise.all([
      TaskList.getModel().where({taskWallId: board.id}).fetchAll({withRelated: [{
        'cards.creater': function(qb){
          qb.select('email', 'id')
        },
        'cards.owner': function(qb){
          qb.select('email', 'id')
        }
      }]})
    ]).then(values => {
      const [lists] = values;
      return res.send(board);
    });
  }).catch(next);
});

TaskWallRouter.post('/task-wall', (req, res, next) => {
  const {name, isPublic} = req.body;
  const {jw} = req;

  new TaskWall({
    name,
    ownerId: jw.user.id,
    isPublic: isPublic || false,
    type: TASKWALL_TYPE.NORMAL
  }).bundleCreate().then(taskWall => {
    res.status(201).send(taskWall);
  }).catch(next);
});

TaskWallRouter.put('/task-board/:id/cover', multipartMiddleware, async (req, res, next) => {
  try {
    const imageURLData = req.body.playload.replace(/^data:image\/\w+;base64,/, '');
    const filename = hashFileName(imageURLData);
    // TODO extract 'board-cover' variable
    await saveImage(filename, 'board-cover', imageURLData);

    const savedPath = path.join('board-cover', filename)
    const board = await TaskBoardModel.where({id: req.params.id}).fetch();
    await board.save({cover: savedPath});
    res.json({image: savedPath});
  } catch (error) {
    next(error);
  }
});

TaskWallRouter.patch('/task-board/:boardId', async (req, res, next) => {
  try {
    const board = await TaskBoardModel.forge({id: req.params.boardId}).save(req.body);
    res.status(200).json(board);
  } catch(error) {
    next(error);
  }
});

export {TaskWallRouter};
