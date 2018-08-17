import * as express from 'express';
import { authJwt } from '../middle/jwt';
import { taskBoardGroupForBody } from '../middle/board';
import { TaskCard, TaskCardModel } from '../../model/task-card';
import { TaskCardCommentModel } from '../../model/task-card-comment';
import { GroupModel } from '../../model/group';
import { validateRequest } from '../../service/validate';
import { AccessLimitError, NotFoundError } from '../../service/error';
import * as R from 'ramda';

const TaskBoardSettingRouter = express.Router();

TaskBoardSettingRouter.get('/task-board/:taskBoardId/setting', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const { taskBoardId } = req.body;
    const card = await TaskCardModel.where({
      taskBoardId,
      ownerId: jw.user.id
    }).fetchAll();
    res.json(card);
  } catch (error) {
    next(error);
  }
});

export { TaskBoardSettingRouter };
