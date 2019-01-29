import * as express from 'express';
import { authJwt } from '../middle/jwt';
import { taskBoardParamAuthMiddle } from '../middle/board.middle';
import { TaskBoardSettingModel } from '../../model/task-board-setting.model';

const TaskBoardSettingRouter = express.Router();

TaskBoardSettingRouter.get(
  '/task-board/:taskBoardId/setting',
  authJwt,
  taskBoardParamAuthMiddle,
  async (req, res, next) => {
    try {
      const { taskBoardId } = req.params;
      const card = await TaskBoardSettingModel.where({
        boardId: taskBoardId
      }).fetch();
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
    } = req.body;
    const { taskBoardId } = req.params;
    TaskBoardSettingModel.where({ boardId: taskBoardId })
      .save(body, { method: 'update' })
      .then(() => {
        res.status(200).send();
      })
      .catch(error => {
        next(error);
      });
  }
);

export { TaskBoardSettingRouter };
