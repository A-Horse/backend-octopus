import express from 'express';
import { authJwt } from '../middle/jwt';
import { TodoBoxModel } from '../../model/todo-box';

const TodoBoxRouter = express.Router();

TodoBoxRouter.post('/todo-box', authJwt, async (req, res, next) => {
  const { jw } = req;
  try {
    const todoBox = await new TodoBoxModel({
      creatorId: jw.user.id,
      ownerId: jw.user.id,
      name: req.body.name,
      type: req.body.type
    }).save();
    res.status(201).json(todoBox);
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

TodoBoxRouter.get('/user/:userId/todo-box', authJwt, async (req, res, next) => {
  const { jw } = req;
  const todoBoxs = await TodoBoxModel.where({ userId: jw.user.id }).fetchAll();
  res.json(todoBoxs);
});

export { TodoBoxRouter };
