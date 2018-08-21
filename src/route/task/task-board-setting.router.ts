import * as express from 'express';
import { authJwt } from '../middle/jwt';
import { taskBoardGroupForBody } from '../middle/board';
import { TaskCard, TaskCardModel } from '../../model/task-card';
import { TaskCardCommentModel } from '../../model/task-card-comment';
import { GroupModel } from '../../model/group';
import { validateRequest } from '../../service/validate';
import { AccessLimitError, NotFoundError } from '../../service/error';
import * as R from 'ramda';
import { taskBoardParamAuthMiddle } from '../middle/board.middle';
import { TaskBoardSettingModel } from '../../model/task-board-setting.model';

const TaskBoardSettingRouter = express.Router();

TaskBoardSettingRouter.get(
  '/task-board/:taskBoardId/setting',
  authJwt,
  taskBoardParamAuthMiddle,
  async (req, res, next) => {
    try {
      const { jw } = req;
      const { taskBoardId } = req.body;
      const card = await TaskBoardSettingModel.where({
        taskBoardId,
        ownerId: jw.user.id
      }).fetchAll();
      res.json(card);
    } catch (error) {
      next(error);
    }
  }
);

TaskBoardSettingRouter.patch(
  '/task-board/:taskBoardId/setting',
  authJwt,
  taskBoardParamAuthMiddle,
  (req, res, next) => {
    const body: {
      showType?: string;
    } =
      req.body;
    const { taskBoardId } = req.params;
    TaskBoardSettingModel
      .where({boardId: taskBoardId})
      .save(body, {method: 'update'})
      .then(() => {
        res.status(200).send();
      })
      .catch(error => {
        next(error);
      });
  }
);

export { TaskBoardSettingRouter };
