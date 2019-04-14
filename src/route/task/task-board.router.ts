import * as express from 'express';
import { bookshelf } from '../../db/bookshelf';
import { authJwt } from '../../route/middle/jwt';
import { NotFoundError, DuplicateError } from '../../service/error';
import { TaskBoardModel } from '../../model/task-board';
import { TaskAccessModel } from '../../model/task-access';
import * as R from 'ramda';
import * as path from 'path';
import { saveImage } from '../../service/storage';
import { knex } from '../../db/bookshelf';
import * as md5 from 'blueimp-md5';
import { TaskBoardSettingModel } from '../../model/task-board-setting.model';
import {
  createTaskBoard,
  saveTaskBoard,
  getUserTaskBoards,
  getTaskBoardFromUser,
  updateTaskBoardCover
} from '../../app/task/task-board.app';
import { TaskBoard } from '../../domain/task-board/task-board.domain';
import { ITaskBoard } from '../../typing/task-board.typing';

const TaskBoardRouter = express.Router();

const multipartMiddleware = require('connect-multiparty')();

const COVER_STORAGE_PATH = 'board-cover';

TaskBoardRouter.get('/v2/user/:userId/task-board', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const boards: ITaskBoard[] = await getUserTaskBoards(jw.user.id);
    res.json(boards);
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.get('/v2/task-board/:id/verbose', authJwt, async (req, res, next) => {
  const { id } = req.params;
  const { jw } = req;
  try {
    const board = await getTaskBoardFromUser(id, jw.user.id);
    return res.send(board);
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.delete('/task-board/:boardId', authJwt, async (req, res, next) => {
  // TODO 只要 owner 才能删除
  try {
    const { boardId } = req.params;
    await TaskBoardModel.where({ id: boardId }).save(
      { status: 'DELETED' },
      { method: 'update' }
    );
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.post('/task-board', authJwt, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  bookshelf
    .transaction(t => {
      const boardPromise = new TaskBoardModel({
        name,
        ownerId: jw.user.id,
        createrId: jw.user.id
      }).save(null, { transacting: t });

      const taskAccessPromise = boardPromise.then(board => {
        return new TaskAccessModel({
          userId: jw.user.id,
          boardId: board.id,
          level: 5,
          created_at: new Date()
        }).save(null, { transacting: t });
      });

      const taskBoardSettingPromise = boardPromise.then(board => {
        return new TaskBoardSettingModel().save(
          {
            boardId: board.id,
            created_at: new Date().getTime(),
            updated_at: new Date().getTime()
          },
          { transacting: t }
        );
      });

      return Promise.all([boardPromise, taskAccessPromise, taskBoardSettingPromise]);
    })
    .then(([board, taskAccess]) => {
      res.json(board);
    })
    .catch(error => {
      next(error);
    });
});

TaskBoardRouter.post('/v2/task-board', authJwt, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  try {
    const taskBoard: TaskBoard = createTaskBoard(jw.user.id, name);
    await saveTaskBoard(taskBoard);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

TaskBoardRouter.get(
  '/task-board/:boardId/participant',
  authJwt,
  async (req, res, next) => {
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
  }
);

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

TaskBoardRouter.post(
  '/v2/task-board/:id/cover',
  multipartMiddleware,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const coverFilename: string = await updateTaskBoardCover(req.body.cover, id);
      res.json({ cover: coverFilename });
    } catch (error) {
      next(error);
    }
  }
);

TaskBoardRouter.patch('/task-board/:boardId', async (req, res, next) => {
  try {
    const board = await TaskBoardModel.forge({ id: req.params.boardId }).save(req.body);
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
});

export { TaskBoardRouter };
