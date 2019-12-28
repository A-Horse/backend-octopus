import * as express from 'express';
import { check, query } from 'express-validator';

import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { validate } from '../../util/express-validate';
import { ProjectIssue } from './project-issue';
import { ProjectIssueApplicationService } from './project-issue-application-service';
import { ProjectIssueRepository } from './project-issue-repository';

const ProjectIssueRouter = express.Router();

ProjectIssueRouter.get(
  '/kanban/:kanbanId/column/:columnId/cards',
  authorizedRequestMiddle,
  async (req, res, next) => {
    const { name } = req.body;
    const { jw } = req;

    try {
      const cards: ProjectIssue[] = await ProjectIssueApplicationService.getColumnIssues({
        kanbanId: req.params.kanbanId,
        columnId: req.params.columnId
      });

      res.status(200).send(cards.map(c => c.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

ProjectIssueRouter.post('/project/:projectId/issue', authorizedRequestMiddle, async (req, res, next) => {
  const { jw } = req;

  try {
    const cardId: string = await ProjectIssueApplicationService.createIssue({
      creatorId: jw.user.id,
      ...req.body
    });

    res.status(201).send(cardId);
  } catch (error) {
    next(error);
  }
});

ProjectIssueRouter.get(
  '/project/:projectId/issues',
  validate([query('pageSize').isInt(), query('pageNumber').isInt()]),
  authorizedRequestMiddle,
  async (req, res, next) => {
    try {
      const issuesPagtiation = await ProjectIssueApplicationService.getProjectIssues({
        projectId: req.params.projectId,
        pageSize: parseInt(req.query.pageSize, 10),
        pageNumber: parseInt(req.query.pageNumber, 10)
      });

      res.status(201).json(issuesPagtiation);
    } catch (error) {
      next(error);
    }
  }
);

// TODO 权限校验
ProjectIssueRouter.get('/issue/:issueId', authorizedRequestMiddle, async (req, res, next) => {
  try {
    const detailedIssue = await ProjectIssueApplicationService.getDetailedIssue(
      req.params.issueId
    );

    res.json(detailedIssue.toJSON());
  } catch (error) {
    next(error);
  }
});

ProjectIssueRouter.patch('/issue/:issueId', authorizedRequestMiddle, async (req, res, next) => {
  try {
    await ProjectIssueApplicationService.udpateIssue(
      req.params.issueId,
      req.body
    );

    res.status(201).send();
  } catch (error) {
    next(error);
  }
});


export { ProjectIssueRouter };
