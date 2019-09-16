import { ProjectCardApplicationService } from './kanban-card-application-service';
import { ProjectCardRepository } from './kanban-card-repository';

import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';
import { ProjectCard } from './project-card';

const ProjectCardRouter = express.Router();

ProjectCardRouter.get(
  '/kanban/:kanbanId/column/:columnId/cards',
  authJwt,
  async (req, res, next) => {
    const { name } = req.body;
    const { jw } = req;

    try {
      const cards: ProjectCard[] = await ProjectCardApplicationService.getColumnCards({
        kanbanId: req.params.kanbanId,
        columnId: req.params.columnId
      });

      res.status(200).send(cards.map(c => c.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

ProjectCardRouter.post('/project/:projectId/card', authJwt, async (req, res, next) => {
  const { jw } = req;

  try {
    const cardId: string = await ProjectCardApplicationService.createCard({
      creatorId: jw.user.id,
      ...req.body
    });

    res.status(201).send(cardId);
  } catch (error) {
    next(error);
  }
});

export { ProjectCardRouter };
