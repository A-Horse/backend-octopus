import express from 'express';
import {authJwt} from '../middle/jwt';
import {GoalModel} from '../../model/goal.js';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const GoalListRouter = express.Router();

GoalListRouter.use(authJwt);

GoalListRouter.get('/goal', (req, res) => {
  const {jw} = req;
  new GoalModel({userId: jw.user.id})
    .fetch().then(goals => res.send(goals)).
    catch();
});

GoalListRouter.post('/goal', (req, res) => {
  validateRequest(req.body, 'title', ['required']);
  const {jw} = req;
  new GoalModel({
    userId: jw.user.id,
    title: req.body.title
  }).save().then(goal => {
    res.send(goal);
  });
});

GoalListRouter.delete('/goal/:goalId', (req, res) => {
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

export {GoalListRouter};
