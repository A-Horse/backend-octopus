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

TaskWallRouter.delete('/task-wall/:id', (req, res) => {
  const {id} = req.params;
  TaskWall.getTaskWall({id})
    .destroy()
    .then(() => res.send())
    .catch(error => {throw error});
});

// TODO 重构 userId id
TaskWallRouter.get('/user/:userId/task-wall/:id/all', (req, res) => {
  const {id} = req.params;
  const {jw} = req;

  TaskWall.getModel().where({id}).fetch()
    .then(taskWall => {
      if( !taskWall ) throw new NotFoundError('task wall not found')
      // TODO check is public
      return Group.getModel().where({
        taskWallId: taskWall.id,
        userId: jw.user.id
      }).fetch().then(access => {
        if( !access ) throw new AccessLimitError('can access this task wall');        
        return Promise.all([
          TaskCard.getModel().where({taskWallId: taskWall.id}).fetchAll({withRelated: ['creater']}),
          TaskList.getModel().where({taskWallId: taskWall.id}).fetchAll()
        ]).then(values => {
          const [cards, categorys] = values;
          return res.send({
            info: taskWall,
            cards: cards,
            lists: categorys,
            // category: categorys
          });
        })
      })
    }).catch(error => {console.log('sdsd'); throw error})
});


TaskWallRouter.post('/task-wall', (req, res, next) => {
  let {name, isPublic} = req.body;
  let {jw} = req;
  
  new TaskWall({
    name,
    ownerId: jw.user.id,
    isPublic: isPublic || false,
    type: TASKWALL_TYPE.NORMAL
  }).bundleCreate().then(taskWall => {
    res.status(201).send(taskWall);
  }).catch(error => {throw error});
});

export {TaskWallRouter};
