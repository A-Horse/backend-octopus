import express from 'express';
import {authJwt} from '../middle/jwt';
import {TodoModel} from '../../model/todo';
import {TodoBoxModel} from '../../model/todo-box';
import {TodoBoxAccessModel} from '../../model/todo-box-access';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'ramda';

const TodoListRouter = express.Router();

TodoListRouter.get('/user/:userId/todo', authJwt, (req, res, next) => {
  const { jw } = req;
  const { userId } = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }
  new TodoModel({userId: jw.user.id})
    .fetchAll().then(todos => res.send(todos))
    .catch(next);
});

TodoListRouter.post('/user/:userId/todo', authJwt, async (req, res, next) => {
  try {
    validateRequest(req.body, 'content', ['required']);
    // TODO auth
    const {jw} = req;
    const todo = await new TodoModel({
      userId: jw.user.id,
      content: req.body.content,
      deadline: req.body.deadline,
      created_at: new Date().getTime()
    }).save();
    res.send(todo);
  } catch (error) {
    next(error);
  }
});

TodoListRouter.delete('/todo/:todoId', authJwt, (req, res) => {
  const {todoId} = req.params;
  const {jw} = req;
  new TodoModel({
    id: todoId
  }).fetch().then(goal => {
    goal.destroy().then(function(){
      res.status(202).send();
    });
  });
});

TodoListRouter.patch('/todo/:todoId', authJwt, (req, res, next) => {
  // TODO auth
  new TodoModel({
    id: req.params.todoId
  }).fetch().then(function(todo) {
    todo.save(req.body).then(todo => {
      res.send(todo);
    });
  }).catch(next);
});

TodoListRouter.patch('/user/:userId/todo/:todoId', authJwt, (req, res, next) => {
  // TODO auth
  new TodoModel({
    id: req.params.todoId
  }).fetch().then(function(todo) {
    todo.save(req.body).then(todo => {
      res.send(todo);
    });
  }).catch(next);
});

export { TodoListRouter };
