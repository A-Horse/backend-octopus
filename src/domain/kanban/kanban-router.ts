import { kanbanApplicationService } from './kanban-application-service';
import { Kanban } from './kanban';

import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';

const KanbanRouter = express.Router();

KanbanRouter.get('/project/:projectId/kanbans', authJwt, async (req, res, next) => {
  try {
    const kanbans: Kanban[] = await kanbanApplicationService.getProjectKanbans(
      req.params.projectId
    );
    res.json(kanbans.map(k => k.toJSON()));
  } catch (error) {
    next(error);
  }
});



export { KanbanRouter };
