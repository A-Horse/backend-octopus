import express from 'express';
import { authJwt } from '../middle/jwt';
import { taskBoardGroupForBody } from '../middle/board';
import { TaskCard, TaskCardModel } from '../../model/task-card';
import { TaskCardCommentModel } from '../../model/task-card-comment';
import { GroupModel } from '../../model/group';
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

  try {
    const data = R.pick(['title', 'taskWallId', 'taskListId'], req.body);
    const { jw } = req;
    const existCount = await TaskCardModel.where({taskListId: data.taskListId}).count();
    const createdCard = await new TaskCardModel(Object.assign({}, data, {
      createrId: jw.user.id,
      index: existCount + 1
    })).save();
    res.status(201).send(createdCard);
  } catch (error) {
    next(error);
  }
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

TaskCardRouter.patch('/task-board/:boardId/task-card/index', authJwt, async (req, res, next) => {
  // TODO auth board
  try {
    const {cardIndexs} = req.body;
    const result = await Promise.all(cardIndexs.map(async (trackIndex) => {
      const card = await TaskCardModel.forge({id: trackIndex.id}).save({index: trackIndex.index});
      return card;
    }));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

TaskCardRouter.get('/task-card/:cardId', authJwt, async (req, res, next) => {
  // TODO AUTH
  try {
    const { cardId } = req.params;
    const { jw } = req;
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
    const access = await GroupModel.where({
      taskWallId: card.taskWallId,
      userId: jw.user.id
    });
    if (access) {
      return res.json(card);
    }
    throw new new AccessLimitError('can access this card.');
  } catch (error) {
    next(error);
  }
});

TaskCardRouter.post('/task-card/:taskCardId/comment', authJwt, async (req, res, next) => {
  try {
    const { taskCardId } = req.params;
    const { content } = req.body;
    const { jw } = req;
    const taskCardComment = await new TaskCardCommentModel({
      createrId: jw.user.id,
      content,
      taskCardId,
      created_at: new Date()
    }).save();
    res.json(taskCardComment);
  } catch (error) {
    next(error);
  }
});

export { TaskCardRouter };
