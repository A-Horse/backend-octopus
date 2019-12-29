import * as express from 'express';

import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { Project } from './model/project';
import { ProjectApplicationService } from './project-application-service';

const multipartMiddleware = require('connect-multiparty')();

const ProjectRouter = express.Router();

ProjectRouter.get('/projects', authorizedRequestMiddle, async (req, res, next) => {
  try {
    const { jw } = req;
    const projects: Project[] = await ProjectApplicationService.getUserProjects(
      jw.user.id
    );

    res.json(projects.map(p => p.toJSON()));
  } catch (error) {
    next(error);
  }
});

ProjectRouter.post('/project', authorizedRequestMiddle, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  try {
    await ProjectApplicationService.createProject({
      name,
      creatorId: jw.user.id
    });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

ProjectRouter.get(
  '/project/:projectId',
  authorizedRequestMiddle,
  async (req, res, next) => {
    try {
      const project = await ProjectApplicationService.getProjectDetail(
        req.params.projectId
      );
      res.status(200).send(project.toJSON());
    } catch (error) {
      next(error);
    }
  }
);

ProjectRouter.post(
  '/project/:projectId/kanban',
  authorizedRequestMiddle,
  async (req, res, next) => {
    const { name } = req.body;
    const { jw } = req;

    try {
      const id = await ProjectApplicationService.createProjectKanban({
        name,
        creatorId: jw.user.id,
        projectId: req.params.projectId
      });
      res.status(200).send(id);
    } catch (error) {
      next(error);
    }
  }
);

ProjectRouter.post(
  '/project/:projectId/setting/default-kanban/:kanbanId',
  authorizedRequestMiddle,
  async (req, res, next) => {
    const { projectId, kanbanId } = req.params;

    try {
      await ProjectApplicationService.setProjectDefaultKanban({
        projectId,
        kanbanId
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

ProjectRouter.post(
  '/project/:projectId/cover',
  multipartMiddleware,
  authorizedRequestMiddle,
  async (req, res, next) => {
    const { projectId } = req.params;
    const projectApplicationService = new ProjectApplicationService();
    try {
      await projectApplicationService.updateProjectCover(projectId, req.body.cover);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

export { ProjectRouter };
