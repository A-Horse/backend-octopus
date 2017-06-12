import express from 'express';
import { authJwt } from '../middle/jwt';
import { taskBoardGroupForBody } from '../middle/board';
import { TaskCard, TaskCardModel } from '../../model/task-card';
import { TaskCardCommentModel } from '../../model/task-card-comment';
import { Group } from '../../model/group';
import { validateRequest } from '../../service/validate';
import { AccessLimitError, NotFoundError } from '../../service/error';
import R from 'fw-ramda';

const TaskCardRouter = express.Router();

TaskCardRouter.get('/task-card', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const { taskWallId } = req.body;
    const card = await TaskCardModel.where({
      ownerId: jw.user.id,
      taskWallId: taskWallId
    }).fetchAll();
    res.json(card);
  } catch(error) {
    next(error);
  }
});

TaskCardRouter.delete('/task-card/:id', authJwt, async (req, res, next) => {
  const { id } = req.params;
  try {
    await TaskCardModel.where({id}).destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

TaskCardRouter.post('/task-card', authJwt, taskBoardGroupForBody, async (req, res, next) => {
  validateRequest(req.body, 'title', ['required']);
  validateRequest(req.body, 'taskWallId', ['required']);
  validateRequest(req.body, 'taskListId', ['required']);

  const data = R.pick(['title', 'taskWallId', 'taskListId'], req.body);
  const { jw } = req;
  const existNumber = await TaskCardModel.where({taskListId: data.taskListId}).count();
  new TaskCard(Object.assign({}, data, {
    createrId: jw.user.id,
    index: existNumber + 1
  })).model.save().then(taskCard => {
    res.status(201).send(taskCard);
  });
});

TaskCardRouter.patch('/task-card/:cardId', authJwt, async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await new TaskCardModel({id: cardId}).fetch();
    if (!card) throw new NotFoundError('can not found this task card');

    await card.save(req.body);
    const updatedCard = await new TaskCardModel().where({id: cardId}).fetch({
      withRelated: [{
        'creater': function(qb) {
          qb.select('email', 'id')
        },
        'owner': function(qb) {
          qb.select('email', 'id')
        }
      }]})
    return res.json(updatedCard);
  } catch(error) {next(error)}
});

TaskCardRouter.patch('/task-card/index', authJwt, async (req, res, next) => {
  // TODO auth batch sql and then check
  const {cardIndexs} = req.body;
  const result = await Promise.all(cardIndexs.map(async (trackIndex) => {
    const card = await TaskCardModel.forge({id: trackIndex.id}).save({index: trackIndex.index});
    return card;
  }));
  res.status(200).json(result);
});

TaskCardRouter.get('/task-card/:cardId', authJwt, async (req, res, next) => {
  const {cardId} = req.params;
  // TODO 空的不用放在 Object 里面
  const card = await new TaskCardModel({id: cardId}).fetch({withRelated: [{
    'creater': function(qb) {
      qb.select('email', 'id')
    },
    'owner': function(qb) {
      qb.select('email', 'id')
    },
    // TODO
    'comments': function() {

    },
    'comments.creater': function(qb) {
      qb.select('email', 'id')
    }
  }]});
  res.json(card);
});

TaskCardRouter.post('/task-card/:taskCardId/comment', authJwt, async (req, res, next) => {
  const {taskCardId} = req.params;
  // TODO 权限
  const {content} = req.body;
  const {jw} = req;
  try {
    const taskCardComment = await new TaskCardCommentModel({createrId: jw.user.id, content, taskCardId, created_at: new Date()}).save();
    res.json(taskCardComment);
  } catch (error) {
    next(error);
  }
});

export { TaskCardRouter };
