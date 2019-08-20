import * as express from 'express';

import { authJwt } from '../../route/middle/jwt';
import { Project } from './model/project';
import { ProjectAppliactionService } from './project-application-service';

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

ProjectRouter.get('/project/:projectId', authJwt, async (req, res, next) => {
  try {
    const project = await ProjectAppliactionService.getProjectDetail(req.params.projectId);
    res.status(200).send(project.toJSON());
  } catch (error) {
    next(error);
  }
});

ProjectRouter.post('/project/:projectId/kanban', authJwt, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  try {
    const id = await ProjectAppliactionService.createProjectKanban({
      name,
      creatorId: jw.user.id,
      projectId: req.params.projectId
    });
    res.status(200).send(id);
  } catch (error) {
    next(error);
  }
});

export { ProjectRouter };
