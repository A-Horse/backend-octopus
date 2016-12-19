import express from 'express';
import {authJwt} from '../middle/jwt';
import {TaskCard, TaskCardModel} from '../../model/task-card';
import {TaskCardCommentModel} from '../../model/task-card-comment';
import {TaskList} from '../../model/task-list';
import {Group} from '../../model/group';
import {validateRequest} from '../../service/validate';
import {AccessLimitError, NotFoundError} from '../../service/error';
import R from 'fw-ramda';

const TaskCardRouter = express.Router();

TaskCardRouter.use(authJwt);

TaskCardRouter.get('/task-card', (req, res) => {
  const {jw} = req;
  const {taskWallId} = req.body;
  TaskCard.getModel().where({
    ownerId: jw.user.id,
    taskWallId: taskWallId
  }).fetchAll().then(data => {
    res.status(200).send(data)
  });
});

TaskCardRouter.delete('/task-card/:id', (req, res) => {
  const {id} = req.params;
  TaskCard.getTaskCard({id})
    .destroy()
    .then(() => {
      res.status(200).send()
    }).catch(error => {
      throw error;
    })
});

TaskCardRouter.post('/task-card', (req, res, next) => {
  validateRequest(req.body, 'title', ['required']);
  validateRequest(req.body, 'taskWallId', ['required']);
  validateRequest(req.body, 'taskListId', ['required']);
  
  const data = R.pick(['title', 'taskWallId', 'taskListId'], req.body);
  const {jw} = req;
  Group.getModel().where({
    taskWallId: data.taskWallId,
    userId: jw.user.id
  }).fetch().then(async (access) => {
    if( !access ) throw new AccessLimitError('can access this task wall');

    const existNumber = await TaskCardModel.where({taskListId: data.taskListId}).count();
    new TaskCard(Object.assign({}, data, {
      createrId: jw.user.id,
      index: ++existNumber
    })).model.save().then(taskCard => {
      res.status(201).send(taskCard);
    });
  }).catch(error => next(error));
});

TaskCardRouter.patch('/task-card/:cardId', async (req, res, next) => {
  const {cardId} = req.params;
  const card = await new TaskCardModel({id: cardId}).fetch();
  if (!card) throw new NotFoundError('can not found this task card');
  card.save(req.body).then(function(card) {
    res.json(card);
  })
});

TaskCardRouter.patch('/task-card/index', async (req, res, next) => {
  // TODO auth batch sql and then check
  const {cardIndexs} = req.body;
  const result = await Promise.all(cardIndexs.map(async (trackIndex) => {
    const card = await TaskCardModel.forge({id: trackIndex.id}).save({index: trackIndex.index});
    return card;
  }));
  res.status(200).json(result);
});

TaskCardRouter.get('/task-card/:cardId', async (req, res, next) => {
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

TaskCardRouter.post('/task-card/:taskCardId/comment', async (req, res, next) => {
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

export {TaskCardRouter};
