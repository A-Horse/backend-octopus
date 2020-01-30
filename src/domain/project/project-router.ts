import * as express from 'express';
import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { Project } from './model/project';
import { ProjectApplicationService } from './project-application-service';
import { DIContainer } from 'src/container/di-container';

const multipartMiddleware = require('connect-multiparty')();

export class ProjectRouter {
  private projectApplicationService: ProjectApplicationService;

  constructor(private container: DIContainer) {
    this.projectApplicationService = new ProjectApplicationService(container);
  }

  public setupRouter(app: express.Application) {
    const router = express.Router();

    router.get('/projects', authorizedRequestMiddle, this.getProjects);
    router.post('/project', authorizedRequestMiddle, this.postProject);
    router.get('/project/:projectId', authorizedRequestMiddle, this.getProject);
    router.post('/project/:projectId/kanban', authorizedRequestMiddle, this.postProjectKanban);
    router.post('/project/:projectId/setting/default-kanban/:kanbanId', authorizedRequestMiddle, this.postProjectDefaultKanban);

    router.post('/project/:projectId/cover', multipartMiddleware, authorizedRequestMiddle, async (req, res, next) => {
      const { projectId } = req.params;
      await this.projectApplicationService.updateProjectCover(projectId, req.body.cover);
      res.status(200).send();
    });

    app.use(router);
  }

  private async getProjects(req, res, next) {
    try {
      const { jw } = req;
      const projects: Project[] = await ProjectApplicationService.getUserProjects(jw.user.id);
      res.json(projects.map(p => p.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  private async postProject(req, res, next) {
    const { name } = req.body;
    const { jw } = req;
    await ProjectApplicationService.createProject({
      name,
      creatorId: jw.user.id
    });
    res.status(200).send();
  }

  private async getProject(req, res, next) {
    const project = await ProjectApplicationService.getProjectDetail(req.params.projectId);
    res.status(200).send(project.toJSON());
  }

  private async postProjectKanban(req, res, next) {
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

  private async postProjectDefaultKanban(req, res, next) {
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
}
