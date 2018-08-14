import * as express from 'express';
import { authJwt } from '../middle/jwt';
import { taskBoardGroupForBody } from '../middle/board';
import { TaskCard, TaskCardModel } from '../../model/task-card';
import { TaskCardCommentModel } from '../../model/task-card-comment';
import { GroupModel } from '../../model/group';
import { validateRequest } from '../../service/validate';
import { AccessLimitError, NotFoundError } from '../../service/error';
import * as R from 'ramda';

const TaskCardRouter = express.Router();

TaskCardRouter.get('/task-card', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const { taskBoardId } = req.body;
    const card = await TaskCardModel.where({
      taskBoardId,
      ownerId: jw.user.id
    }).fetchAll();
    res.json(card);
  } catch (error) {
    next(error);
  }
});

TaskCardRouter.delete('/task-card/:id', authJwt, async (req, res, next) => {
  const { id } = req.params;
  try {
    await TaskCardModel.where({ id }).destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

TaskCardRouter.post('/task-card', authJwt, taskBoardGroupForBody, async (req, res, next) => {
  validateRequest(req.body, 'title', ['required']);
  validateRequest(req.body, 'boardId', ['required']);
  validateRequest(req.body, 'trackId', ['required']);
  try {
    const data = R.pick(['title', 'boardId', 'trackId'], req.body);
    const { jw } = req;
    const existCount = await TaskCardModel.where({ taskTrackId: data.trackId }).count();
    const createdCard = await new TaskCardModel(
      Object.assign({
        taskBoardId: data.boardId,
        taskTrackId: data.trackId,
        title: data.title,
        createrId: jw.user.id,
        index: existCount + 1,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime()
      })
    ).save();
    const card = await new TaskCardModel({ id: createdCard.id }).fetch({
      withRelated: [
        {
          creater: qb => {
            qb.select('email', 'id');
          },
          owner: qb => {
            qb.select('email', 'id');
          }
        }
      ]
    });
    res.status(201).send(card);
  } catch (error) {
    next(error);
  }
});

TaskCardRouter.patch('/task-card/:cardId', authJwt, async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await new TaskCardModel({ id: cardId }).fetch();
    if (!card) {
      throw new NotFoundError('can not found this task card');
    }

    await card.save(req.body);

    const updatedCard = await new TaskCardModel().where({ id: cardId }).fetch({
      withRelated: [
        {
          creater: qb => {
            qb.select('email', 'id');
          },
          owner: qb => {
            qb.select('email', 'id');
          }
        }
      ]
    });
    return res.json(updatedCard);
  } catch (error) {
    throw error;
  }
});

TaskCardRouter.patch('/task-cards/move-batch', authJwt, async (req, res, next) => {
  // TODO 判断每一个 card 的权限
  try {
    const cards = req.body;
    const result = await Promise.all(
      Object.values(cards).map(async (card: any) => {
        const updatedCard = await TaskCardModel.forge({ id: card.id }).save({
          index: card.index,
          taskTrackId: card.taskTrackId
        });
        return updatedCard;
      })
    );
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

TaskCardRouter.get('/task-card/:cardId', authJwt, async (req, res, next) => {
  // TODO AUTH
  try {
    const { cardId } = req.params;
    const { jw } = req;
    const card = await new TaskCardModel({ id: cardId }).fetch({
      withRelated: [
        {
          creater: qb => {
            qb.select('email', 'id');
          },
          owner: qb => {
            qb.select('email', 'id');
          },
          comments: () => {},
          'comments.creater': (qb) => {
            qb.select('email', 'id');
          }
        }
      ]
    });
    const access = await GroupModel.where({
      taskBoardId: card.taskBoardId,
      userId: jw.user.id
    });
    if (access) {
      return res.json(card);
    }
    throw new AccessLimitError('can access this card.');
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
