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

KanbanRouter.post('/project/:projectId/kanban', authJwt, async (req, res, next) => {
  const { name } = req.body;
  const { jw } = req;

  try {
    await kanbanApplicationService.createProjectKanban({
      name,
      creatorId: jw.user.id
    });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
});


export { KanbanRouter };
