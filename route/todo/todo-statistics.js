import express from 'express';
import { authJwt } from '../middle/jwt';
import { TodoRepeatModel } from '../../model/todo-repeat';
import { validateRequest } from '../../service/validate';
import { tdPermissions } from '../middle/auth';

const TodoStatisticsRouter = express.Router();

TodoStatisticsRouter.get('/todo/:todoId/history', authJwt, tdPermissions, async (req, res, next) => {
  try {
    const repeats = await TodoRepeatModel.where({
      todoId: req.params.todoId
    }).query('limit', '7').fetchAll();
    res.json(repeats);
  } catch (error) {
    next(error);
  }
});

TodoStatisticsRouter.post('/todo/:todoId/history/yestory', authJwt, tdPermissions, async (req, res, next) => {
  try {
    await TodoRepeatModel.forge({
      todoId: req.params.todoId
    }).save( req.body );
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

TodoStatisticsRouter.get('/todo/:todoId/statistics', authJwt, tdPermissions, async (req, res, next) => {
  try {
    const repeats = await new TodoRepeatModel({
      todoId: req.params.todoId
    }).fetchAll();
    res.json(repeats);
  } catch (error) {
    next(error);
  }
});

export { TodoStatisticsRouter };
