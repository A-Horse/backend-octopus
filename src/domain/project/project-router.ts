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

const ProjectRouter = express.Router();

const multipartMiddleware = require('connect-multiparty')();

ProjectRouter.get('/projects', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const projects: Project[] = await ProjectAppliactionService.getUserProjects(jw.user.id);
    
    res.json(projects.map(p => p.toJSON()));
  } catch (error) {
    next(error);
  }
});

ProjectRouter.post('/project', authJwt, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  try {
    await ProjectAppliactionService.createProject({
      name,
      creatorId: jw.user.id
    });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export { ProjectRouter };
