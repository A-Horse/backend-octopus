import { KanbanCardApplicationService } from './kanban-card-application-service';
import { KanbanCardRepository } from './kanban-card-repository';

import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';
import { KanbanCard } from './kanban-card';

const KanbanCardRouter = express.Router();

KanbanCardRouter.get(
  '/kanban/:kanbanId/column/:columnId/cards',
  authJwt,
  async (req, res, next) => {
    const { name } = req.body;
    const { jw } = req;

    try {
      const cards: KanbanCard[] = await KanbanCardApplicationService.getColumnCards({
        kanbanId: req.params.kanbanId,
        columnId: req.params.columnId
      });

      res.status(200).send(cards.map(c => c.toJSON()));
    } catch (error) {
      next(error);
    }
  }
);

KanbanCardRouter.post('/project/:projectId/card', authJwt, async (req, res, next) => {
  const { jw } = req;

  try {
    const cardId: string = await KanbanCardApplicationService.createCard({
      creatorId: jw.user.id,
      ...req.body
    });

    res.status(201).send(cardId);
  } catch (error) {
    next(error);
  }
});

export { KanbanCardRouter };
