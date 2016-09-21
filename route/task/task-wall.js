import express from 'express';
import {authJwt} from '../middle/jwt';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {TaskWall, TASKWALL_TYPE} from '../../model/task-wall';
import {TaskCard} from '../../model/task-card';
import {TaskList} from '../../model/task-list';
import {Group} from '../../model/group';

const TaskWallRouter = express.Router();
TaskWallRouter.use(authJwt);

TaskWallRouter.get('/task-wall', (req, res, next) => {
  const {jw} = req;
  TaskWall.getModel().where({
    ownerId: jw.user.id
  }).fetchAll().then(data => res.send(data));
});

TaskWallRouter.delete('/task-wall/:id', (req, res, next) => {
  const {id} = req.params;
  TaskWall.getTaskWall({id})
    .destroy()
    .then(() => res.send())
    .catch(next);
});

TaskWallRouter.get('/user/:userId/task-wall/:wallId/all', (req, res, next) => {
  const {wallId} = req.params;
  const {jw} = req;

  TaskWall.getModel().where({id: wallId}).fetch()
    .then(taskWall => {
      if (!taskWall) throw new NotFoundError();
      return Group.getModel().where({
        taskWallId: taskWall.id,
        userId: jw.user.id
      }).fetch().then(access => {
        if (!access) throw new AccessLimitError();
        return Promise.all([
          TaskCard.getModel().where({taskWallId: taskWall.id}).fetchAll({withRelated: [{
            creater: function(qb) {
              qb.select('email', 'id')
            }}]}),
          TaskList.getModel().where({taskWallId: taskWall.id}).fetchAll({withRelated: [{
            'cards.creater': function(qb){
              qb.select('email', 'id')
            }
          }]})
        ]).then(values => {
          const [cards, lists] = values;
          return res.send({
            wall: taskWall,
            lists: lists
          });
        });
      });
    }).catch(next);
});


TaskWallRouter.post('/task-wall', (req, res, next) => {
  const {name, isPublic} = req.body;
  const {jw} = req;

  new TaskWall({
    name,
    ownerId: jw.user.id,
    isPublic: isPublic || false,
    type: TASKWALL_TYPE.NORMAL
  }).bundleCreate().then(taskWall => {
    res.status(201).send(taskWall);
  }).catch(next);
});

export {TaskWallRouter};
