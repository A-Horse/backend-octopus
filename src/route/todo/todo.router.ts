import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';
import { TodoModel } from '../../model/todo.model';
import { AccessLimitError } from '../../service/error';
import { validateRequest } from '../../service/validate';
import { TaskCardModel } from '../../model/task-card';

const TodoRouter = express.Router();

TodoRouter.get('/user/:userId/todo', authJwt, (req, res, next) => {
  const { jw } = req;
  const { userId } = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }
  new TodoModel()
    .query({ where: { isDelete: null, userId: jw.user.id } })
    .fetchAll()
    .then(todos => res.send(todos))
    .catch(next);
});

TodoRouter.get('/user/:userId/todo-task', authJwt, (req, res, next) => {
  const { jw } = req;
  const { userId } = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }
  new TaskCardModel()
    .query({ where: { createrId: jw.user.id, type: 'TODO' } })
    .fetchAll()
    .then(taskCards => res.send(taskCards))
    .catch(next);
});


TodoRouter.post('/todo', authJwt, async (req, res, next) => {
  try {
    validateRequest(req.body, 'content', ['required']);
    const { jw } = req;
    const todo = await TodoModel.where().save({
      userId: jw.user.id,
      content: req.body.content,
      deadline: req.body.deadline,
      todoBoxId: req.body.todoBoxId,
      created_at: new Date().getTime()
    });
    res.send(todo);
  } catch (error) {
    next(error);
  }
});

TodoRouter.delete('/todo/:todoId', authJwt, async (req, res) => {
  const { todoId } = req.params;
  await TodoModel.forge({ id: todoId }).save({ isDelete: true });
  res.status(202).send();
});

TodoRouter.patch('/todo/:todoId', authJwt, (req, res, next) => {
  TodoModel.where({
    id: req.params.todoId
  })
    .fetch()
    .then(function(todo) {
      todo.save(req.body).then(todo => {
        res.send(todo);
      });
    })
    .catch(next);
});

TodoRouter.patch('/user/:userId/todo/:todoId', authJwt, (req, res, next) => {
  TodoModel.where({
    id: req.params.todoId
  })
    .fetch()
    .then(function(todo) {
      todo.save(req.body).then(todo => {
        res.send(todo);
      });
    })
    .catch(next);
});

export { TodoRouter };
