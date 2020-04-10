import * as express from 'express';
import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { Project } from './model/project';
import { ProjectApplicationService } from './project-application-service';
import { DIContainer } from 'src/container/di-container';
import { UpdateProjectCommand } from './command/update-project-command';

const multipartMiddleware = require('connect-multiparty')();

export class ProjectRouter {
  private projectApplicationService: ProjectApplicationService;

  constructor(private container: DIContainer) {
    this.projectApplicationService = new ProjectApplicationService(container);
  }

  public setupRouter(app: express.Application) {
    const router = express.Router();

    router.get('/projects', authorizedRequestMiddle, this.getProjects);
    router.patch('/project/:projectID', authorizedRequestMiddle, this.updateProject);
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

  private getProjects = async (req, res) => {
    const { jw } = req;
    const projects: Project[] = await ProjectApplicationService.getUserProjects(jw.user.id);
    res.json(projects.map(p => p.toJSON()));
  };

  private updateProject = async (req, res) => {
    await this.projectApplicationService.updateProject(req.params.projectID, req.body as UpdateProjectCommand);
    res.status(200).send();
  };

  private postProject = async (req, res) => {
    const { name } = req.body;
    const { jw } = req;
    await ProjectApplicationService.createProject({
      name,
      creatorId: jw.user.id
    });
    res.status(200).send();
  };

  private getProject = async (req, res, next) => {
    const project = await this.projectApplicationService.getProjectDetail(req.params.projectId);
    res.status(200).send(project.toJSON());
  };

  private async postProjectKanban(req, res, next) {
    const { name } = req.body;
    const { jw } = req;

    try {
      const id = await this.projectApplicationService.createProjectKanban({
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
      await this.projectApplicationService.setProjectDefaultKanban({
        projectId,
        kanbanId
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}
