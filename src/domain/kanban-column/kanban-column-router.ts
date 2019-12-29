import * as express from 'express';

import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { KanbanColumnApplicationService } from './kanban-column-application-service';

const KanbanColumnRouter = express.Router();

KanbanColumnRouter.post(
  '/kanban/:kanbanId/column',
  authorizedRequestMiddle,
  async (req, res, next) => {
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
  }
);

export { KanbanColumnRouter };
