import * as  express from 'express';
import { authJwt } from '../middle/jwt';
import { TodoBoxModel } from '../../model/todo-box';
import { TodoModel } from '../../model/todo.model';

const TodoBoxRouter = express.Router();

TodoBoxRouter.post('/todo-box', authJwt, async (req, res, next) => {
  const { jw } = req;
  try {
    const todoBox = await new TodoBoxModel({
      creatorId: jw.user.id,
      ownerId: jw.user.id,
      name: req.body.name,
      type: req.body.type || 'normal'
    }).save();
    res.status(201).json(todoBox);
  } catch (error) {
    next(error);
  }
});

TodoBoxRouter.get('/todo-box/:todoBoxId', authJwt, async (req, res, next) => {
  const { jw } = req;
  const { todoBoxId } = req.params;
  try {
    const todos = await new TodoModel()
      .query({ where: { isDelete: null, userId: jw.user.id, todoBoxId: todoBoxId } })
      .fetchAll();
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

TodoBoxRouter.delete('/todo-box', authJwt, async (req, res, next) => {
  const { jw } = req;
  try {
    const todoBox = await new TodoBoxModel({
      creator: jw.user.id,
      name: req.body.name
    }).save();
    res.status(201).json(todoBox);
  } catch (error) {
    next(error);
  }
});

TodoBoxRouter.get('/user/:userId/todo-box', authJwt, async (req, res) => {
  const { jw } = req;
  const todoBoxs = await TodoBoxModel.where({ creatorId: jw.user.id }).fetchAll();
  res.json(todoBoxs);
});

export { TodoBoxRouter };
