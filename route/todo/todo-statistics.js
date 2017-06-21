import express from 'express';
import { authJwt } from '../middle/jwt';
import { TodoModel } from '../../model/todo';
import { TodoBoxModel } from '../../model/todo-box';
import { TodoRepeatModel } from '../../model/todo-repeat';
import { TodoBoxAccessModel } from '../../model/todo-box-access';
import { AccessLimitError, NotFoundError } from '../../service/error';
import { validateRequest } from '../../service/validate';
import { tdPermissions } from '../middle/auth';
import R from 'fw-ramda';

const TodoStatisticsRouter = express.Router();

TodoStatisticsRouter.get('/todo/:todoId/history', authJwt, tdPermissions, (req, res, next) => {
  const { jw } = req;
  new TodoRepeatModel({
    todoId: req.params.todoIda
  });

});


export { TodoStatisticsRouter };
