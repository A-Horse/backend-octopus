import express from 'express';
import {authJwt} from '../middle/jwt';
import {TodoModel} from '../../model/todo';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const TodoListRouter = express.Router();

TodoListRouter.use(authJwt);

TodoListRouter.get('/user/:userId/todo', (req, res, next) => {
  const {jw} = req;
  const {userId} = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }
  new TodoModel({userId: jw.user.id})
    .fetchAll().then(todos => res.send(todos))
    .catch(next);
});

TodoListRouter.post('/user/:userId/todo', (req, res, next) => {
  validateRequest(req.body, 'content', ['required']);
  // FIXME
  const {jw} = req;
  new TodoModel({
    userId: jw.user.id,
    content: req.body.content
  }).save().then(todo => {
    res.send(todo);
  }).catch(next);
});

TodoListRouter.delete('/todo/:todoId', (req, res) => {
  const {goalId} = this.params;
  const {jw} = req;
  new GoalModel({
    id: goalId
  }).fetch().then(goal => {
    if (goal.userId === jw.user.id) {
      goal.destroy()
    } else {
      
    }
  });
});

export {TodoListRouter};
