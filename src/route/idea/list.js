import express from 'express';
import {authJwt} from '../middle/jwt';
import {GoalModel} from '../../model/idea.js';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const IdeaListRouter = express.Router();

IdeaListRouter.use(authJwt);

IdeaListRouter.get('/user/:userId/idea', (req, res, next) => {
  const {jw} = req;
  const {userId} = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }
  new GoalModel({userId: jw.user.id})
    .fetchAll().then(goals => res.send(goals))
    .catch(next);
});

IdeaListRouter.post('/idea', (req, res) => {
  validateRequest(req.body, 'title', ['required']);
  const {jw} = req;
  new GoalModel({
    userId: jw.user.id,
    title: req.body.title
  }).save().then(goal => {
    res.send(goal);
  }).catch(next);
});

IdeaListRouter.delete('/idea/:ideaId', (req, res) => {
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

export {IdeaListRouter};
