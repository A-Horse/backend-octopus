import * as express from 'express';

import { authJwt } from '../../route/middle/jwt';
import { KanbanColumnApplicationService } from './kanban-column-application-service';

const KanbanColumnRouter = express.Router();

KanbanColumnRouter.post('/kanban/:kanbanId/column', authJwt, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  try {
    const id = await KanbanColumnApplicationService.createKanbanColumn({
      name,
      kanbanId: req.params.kanbanId,
      creatorId: jw.user.id
    });

    res.status(200).send(id);
  } catch (error) {
    next(error);
  }
});

export { KanbanColumnRouter };
