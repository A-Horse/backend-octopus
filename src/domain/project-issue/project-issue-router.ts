import { ProjectIssueApplicationService } from './kanban-issue-application-service';
import { ProjectIssueRepository } from './project-issue-repository';

import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';
import { ProjectCard } from './project-issue';

const ProjectIssueRouter = express.Router();

ProjectIssueRouter.get(
  '/kanban/:kanbanId/column/:columnId/cards',
  authJwt,
  async (req, res, next) => {
    const { name } = req.body;
    const { jw } = req;

    try {
      const cards: ProjectCard[] = await ProjectIssueApplicationService.getColumnCards({
        kanbanId: req.params.kanbanId,
        columnId: req.params.columnId
      });

      res.status(200).send(cards.map(c => c.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

ProjectIssueRouter.post('/project/:projectId/card', authJwt, async (req, res, next) => {
  const { jw } = req;

  try {
    const cardId: string = await ProjectIssueApplicationService.createCard({
      creatorId: jw.user.id,
      ...req.body
    });

    res.status(201).send(cardId);
  } catch (error) {
    next(error);
  }
});

export { ProjectIssueRouter };
