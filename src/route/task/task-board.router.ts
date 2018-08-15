import * as express from 'express';
import { bookshelf } from '../../db/bookshelf.js';
import { authJwt } from '../../route/middle/jwt';
import { AccessLimitError, NotFoundError, DuplicateError } from '../../service/error';
import { TaskWall, TaskBoardModel, TASKWALL_TYPE } from '../../model/task-board';
import { TaskCard, TaskCardModel } from '../../model/task-card';
import { TaskList, TaskTrackModel } from '../../model/task-track';
import { TaskAccessModel } from '../../model/task-access';
import { Group } from '../../model/group';
import * as R from 'ramda';
import * as path from 'path';
import { saveImage } from '../../service/storage';
import { knex } from '../../db/bookshelf';
import * as md5 from 'blueimp-md5';

const TaskBoardRouter = express.Router();

const multipartMiddleware = require('connect-multiparty')();

export function boardAuth(req, res, next) {
  const { boardId } = req.params;
  return next();
}

const COVER_STORAGE_PATH = 'board-cover';

TaskBoardRouter.get('/user/:userId/task-board', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const boards = await knex
      .from('task-board as board')
      .join('task-access as access', 'access.boardId', '=', 'board.id')
      .select('board.*')
      .where('access.userId', '=', jw.user.id);
    res.json(boards);
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.get('/task-board/:id/verbose', authJwt, async (req, res, next) => {
  const { id } = req.params;
  try {
    const board = await new TaskBoardModel()
      .where({ id })
      .fetch({
        withRelated: [
          {
            tracks: R.identity,
            'tracks.cards': R.identity,
            'tracks.cards.creater': qb => {
              qb.select('email', 'id');
            },
            'tracks.cards.owner': qb => {
              qb.select('email', 'id');
            }
          }
        ]
      });
    if (!board) {
      return next(new NotFoundError());
    }
    return res.send(board);
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.delete('/task-board/:boardId', authJwt, boardAuth, async (req, res, next) => {
  // TODO 只要 owner 才能删除
  // TODO 不要硬删除
  try {
    const { boardId } = req.params;
    await TaskBoardModel.where({ id: boardId }).destroy();
    const tracks = await TaskTrackModel.where({ taskBoardId: boardId }).fetchAll();
    tracks.forEach(async track => {
      await TaskCardModel.where({ taskTrackId: track.id }).destroy();
      await track.destroy();
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.post('/task-board', authJwt, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  bookshelf.transaction((t)  => {

    const boardPromise =  new TaskBoardModel({
      name,
      ownerId: jw.user.id,
      createrId: jw.user.id
    }).save(null, {transacting: t});

    const taskAccessPromise = boardPromise.then((board) => {
      return new TaskAccessModel({
        userId: jw.user.id,
        boardId: board.id,
        level: 5,
        created_at: new Date()
      }).save(null, {transacting: t});
    })

    const taskSettingPromise = boardPromise.then((board) => {
      return new TaskAccessModel({
        userId: jw.user.id,
        boardId: board.id,
        level: 5,
        created_at: new Date()
      }).save(null, {transacting: t});
    });


    return Promise.all([boardPromise, taskAccessPromise])

  }).then(([board, taskAccess]) => {
    console.log(board, taskAccess);
    res.json(board);
  }).catch((error) =>  {
    next(error);
  });

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
    res.json(participants);
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.post('/task-board/:boardId/invite', authJwt, async (req, res, next) => {
  try {
    if (
      await TaskAccessModel.where({
        userId: req.body.userId,
        boardId: req.body.boardId
      }).fetch()
    ) {
      return next(new DuplicateError());
    }

    const taskAccess = await new TaskAccessModel({
      userId: req.body.userId,
      boardId: req.body.boardId,
      created_at: new Date().getTime()
    }).save();
    res.json(taskAccess);
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.post('/task-board/:id/cover', multipartMiddleware, async (req, res, next) => {
  try {
    const imageURLData = req.body.cover.replace(/^data:image\/\w+;base64,/, '');
    const hash = md5(imageURLData + Date.now()).substring(0, 20);
    const filename = R.compose(R.join('-'), R.splitEvery(5))(hash);

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
