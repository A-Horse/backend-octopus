import * as express from 'express';
import { authJwt } from '../middle/jwt';
import { TaskList, TaskListModel } from '../../model/task-list';
import { Group } from '../../model/group';
import { AccessLimitError, NotFoundError } from '../../service/error';
import { validateRequest } from '../../service/validate';

const TaskListRouter = express.Router();

// TaskListRouter.use(authJwt);

TaskListRouter.get('/task-board/:wallId/list/:listId', (req, res) => {
  const { listId } = this.params;
  TaskList.getModel()
    .where({ id: listId })
    .fetch()
    .then(taskList => {
      if (!taskList) throw new NotFoundError('not found this task list');
      return res.send(taskList);
    })
    .catch(error => {
      throw error;
    });
});

TaskListRouter.post('/task-board/:boardId/track', async (req, res) => {
  validateRequest(req.body, 'name', ['required']);
  const { jw } = req;
  const { boardId } = req.params;

  const existNumber = await TaskListModel.where({ taskWallId: boardId }).count();
  const savedTrack = await new TaskListModel().save({
    index: existNumber,
    taskWallId: boardId,
    name: req.body.name
  });
  res.status(201).send({ ...savedTrack.serialize(), cards: [] });
});


TaskListRouter.patch('/task-board/:boardId/track/index', async (req, res) => {
  const { boardId } = req.params;
  const { trackIndexs } = req.body;
  const result = await Promise.all(
    trackIndexs.map(async trackIndex => {
      const track = await TaskListModel.forge({ id: trackIndex.id }).save({
        index: trackIndex.index
      });
      return track;
    })
  );
  res.status(200).json(result);
});

TaskListRouter.patch('/task-board/:wallId/track/:listId', async (req, res) => {
  const { listId } = req.params;
  const info = req.body;
  // TODO 检查是否存在
  const track = await new TaskListModel({ id: listId }).fetch();
  if (!track) throw new NotFoundError('can not found this task track');
  const newTrack = await track.save(info);
  return res.send(newTrack);
});

// TODO rename
TaskListRouter.delete('/task-board/:wallId/track/:listId', (req, res) => {
  const { wallId, listId } = req.params;
  const { jw } = req;
  Group.getModel().where({ taskWallId: wallId, userId: jw.user.id }).fetch().then(access => {
    if (!access) throw new AccessLimitError('can access this task wall');
    new TaskListModel({ id: listId })
      .bundleDelete()
      .then(() => {
        res.status(204).send();
      })
      .catch(error => {
        throw error;
      });
  });
});

export { TaskListRouter };
