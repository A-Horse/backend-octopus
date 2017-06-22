import express from 'express';
import { authJwt } from '../middle/jwt';
import { TodoModel } from '../../model/todo';
import { TodoBoxModel } from '../../model/todo-box';
import { TodoRepeatModel } from '../../model/todo-repeat';
import { validateRequest } from '../../service/validate';
import { tdPermissions } from '../middle/auth';
import R from 'fw-ramda';

const TodoStatisticsRouter = express.Router();

TodoStatisticsRouter.get('/todo/:todoId/history', authJwt, tdPermissions, async (req, res, next) => {
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
