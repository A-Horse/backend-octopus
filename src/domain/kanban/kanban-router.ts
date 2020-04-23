import * as express from 'express';
import { check } from 'express-validator';
import { authorizedRequestMiddle } from '../../route/middle/auth-handle.middle';
import { validate } from '../../util/express-validate';
import { Kanban } from './kanban';
import { param } from 'express-validator';

import { kanbanApplicationService } from './kanban-application-service';

const KanbanRouter = express.Router();

KanbanRouter.get('/project/:projectId/kanbans', validate([param('projectId').isString()]), authorizedRequestMiddle, async (req, res, next) => {
  try {
    const kanbans: Kanban[] = await kanbanApplicationService.getProjectKanbans(req.params.projectId);
    res.json(kanbans.map(k => k.toJSON()));
  } catch (error) {
    next(error);
  }
});

KanbanRouter.get('/kanban/:kanbanId/detail', validate([param('kanbanId').isString()]), authorizedRequestMiddle, async (req, res, next) => {
  try {
    const kanbanDetailData = await kanbanApplicationService.getKanbanDetail(req.params.kanbanId);
    res.json(kanbanDetailData);
  } catch (error) {
    next(error);
  }
});


export { KanbanRouter };
