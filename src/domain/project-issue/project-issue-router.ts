import * as express from 'express';
import { query, body } from 'express-validator';

import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { validate } from '../../util/express-validate';
import { ProjectIssue } from './project-issue';
import { ProjectIssueApplicationService } from './project-issue-application-service';

export class ProjectIssueRouter {
  constructor() {}

  private getColumnIssues = async (req, res) => {
    const cards: ProjectIssue[] = await ProjectIssueApplicationService.getColumnIssues({
      kanbanId: req.params.kanbanId,
      columnId: req.params.columnId
    });
    res.status(200).send(cards.map(c => c.toJSON()));
  };

  private postIssue = async (req, res) => {
    const { jw } = req;
    const cardId: string = await ProjectIssueApplicationService.createIssue({
      creatorId: jw.user.id,
      ...req.body
    });
    res.status(201).send(cardId);
  };

  private getProjectIssue = async (req, res) => {
    const issuesPagination = await ProjectIssueApplicationService.getProjectIssues({
      projectId: req.params.projectId,
      pageSize: parseInt(req.query.pageSize, 10),
      pageNumber: parseInt(req.query.pageNumber, 10)
    });
    res.status(201).json(issuesPagination);
  };

  private getIssue = async (req, res) => {
    const detailedIssue = await ProjectIssueApplicationService.getDetailedIssue(req.params.issueId);
    res.json(detailedIssue.toJSON());
  };

  private patchIssue = async (req, res) => {
    await ProjectIssueApplicationService.udpateIssue(req.params.issueId, req.body);
    res.status(201).send();
  };

  public setupRouter(app: express.Application) {
    const router = express.Router();
    router.get('/kanban/:kanbanId/column/:columnId/issues', authorizedRequestMiddle, this.getColumnIssues);
    router.post('/project/:projectId/issue', validate([body('projectID').isString(), body('title').isString()]), authorizedRequestMiddle, this.postIssue);
    router.get('/project/:projectId/issues', validate([query('pageSize').isInt(), query('pageNumber').isInt()]), authorizedRequestMiddle, this.getProjectIssue);
    // TODO 权限校验
    router.get('/issue/:issueId', authorizedRequestMiddle, this.getIssue);
    router.patch('/issue/:issueId', authorizedRequestMiddle, this.patchIssue);
    app.use(router);
  }
}
