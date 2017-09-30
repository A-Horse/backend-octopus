import { bookshelf } from '../../db/bookshelf.js';
import express from 'express';
import { authJwt } from '../../route/middle/jwt';
import { AccessLimitError, NotFoundError } from '../../service/error';
import { TaskWall, TaskBoardModel, TASKWALL_TYPE } from '../../model/task-wall';
import { TaskCard, TaskCardModel } from '../../model/task-card';
import { TaskList, TaskListModel } from '../../model/task-list';
import { TaskAccessModel } from '../../model/task-access';
import { Group } from '../../model/group';
import R from 'ramda';
import { hashFileName } from '../../service/file';
import path from 'path';
import { saveImage } from '../../service/storage';
import { TaskLogger } from '../../log';

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const TaskBoardRouter = express.Router();

export function boardAuth(req, res, next) {
  const { boardId } = req.params;
  return next();
}

const COVER_STORAGE_PATH = 'board-cover';

TaskBoardRouter.get('/user/:userId/task-board', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const boards = await TaskBoardModel.where({
      ownerId: jw.user.id
    }).fetchAll();
    res.json(boards);
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.get('/task-board/:id/verbose', authJwt, async (req, res, next) => {
  const { id } = req.params;
  const board = await TaskWall.getModel()
    .where({ id })
    .fetch({
      withRelated: [
        {
          tracks: () => {},
          'tracks.cards': () => {},
          'tracks.cards.creater': qb => {
            qb.select('email', 'id');
          },
          'tracks.cards.owner': qb => {
            qb.select('email', 'id');
          }
        }
      ]
    });
  if (!board) return next(new NotFoundError());
  return res.send(board);
});

TaskBoardRouter.delete('/task-board/:boardId', authJwt, boardAuth, async (req, res, next) => {
  // TODO 只要 owner 才能删除
  try {
    const { boardId } = req.params;
    await TaskBoardModel.where({ id: boardId }).destroy();
    const tracks = await TaskListModel.where({ taskWallId: boardId }).fetchAll();
    tracks.forEach(async track => {
      await TaskCardModel.where({ taskListId: track.id }).destroy();
      await track.destroy();
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.post('/task-board', authJwt, async (req, res, next) => {
  try {
    const { name } = req.body;
    const { jw } = req;

    const board = await new TaskBoardModel({
      name,
      ownerId: jw.user.id,
      createrId: jw.user.id
    }).save();

    const taskAccess = await new TaskAccessModel({
      userId: jw.user.id,
      boardId: board.id,
      level: 5,
      created_at: new Date()
    }).save();
    TaskLogger.info('add task-board', board.toJSON(), taskAccess.toJSON());
    res.json(board);
  } catch (error) {
    TaskLogger.error(error);
    next(error);
  }
});

TaskBoardRouter.get('/task-board/:boardId/participant', authJwt, async (req, res, next) => {
  try {
    const participants = await TaskAccessModel.where({
      boardId: req.params.boardId
    }).fetchAll({
      withRelated: [
        {
          user: qb => {
            qb.select('email', 'id', 'username');
          }
        }
      ]
    });
    TaskLogger.info('geet board participants', participants);
    res.json(participants);
  } catch (error) {
    TaskLogger.error('task-board/participant', error);
    next(error);
  }
});

TaskBoardRouter.post('/task-board/:id/cover', multipartMiddleware, async (req, res, next) => {
  try {
    const imageURLData = req.body.cover.replace(/^data:image\/\w+;base64,/, '');
    const filename = hashFileName(imageURLData);
    await saveImage(filename, COVER_STORAGE_PATH, imageURLData);
    const savedPath = path.join(COVER_STORAGE_PATH, filename);
    const board = await TaskBoardModel.where({ id: req.params.id }).fetch();
    await board.save({ cover: savedPath });
    res.json({ cover: savedPath });
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.patch('/task-board/:boardId', async (req, res, next) => {
  try {
    const board = await TaskBoardModel.forge({ id: req.params.boardId }).save(req.body);
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
});

export { TaskBoardRouter };
