import { ProjectAppliactionService } from './project-application-service';
import { Project } from './model/project';

import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';
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

TaskBoardRouter.get('/projects', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const projects: Project[] = await ProjectAppliactionService.getUserProjects(jw.user.id);
    res.json(projects);
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

export { TaskBoardRouter };
