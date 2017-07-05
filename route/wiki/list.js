import express from 'express';
import { authJwt } from '../middle/jwt';
import { WikiModel } from '../../model/wiki';
import { AccessLimitError, NotFoundError } from '../../service/error';
import { validate } from '../middle/check';
import R from 'ramda';
import uuidV1 from 'uuid/v1';

const WikiListRouter = express.Router();

WikiListRouter.get('/user/:userId', authJwt, (req, res, next) => {
  const { jw } = req;
  new WikiModel({ userId: jw.user.id })
    .query({ where: { isDelete: null } })
    .fetchAll()
    .then(res.send)
    .catch(next);
});

WikiListRouter.post(
  '/user/:userId',
  authJwt,
  validate({
    title: ['required']
  }),
  async (req, res, next) => {
    try {
      const { jw } = req;
      const wiki = await new WikiModel({
        aid: uuidV1(),
        userId: jw.user.id,
        title: req.body.title,
        created_at: new Date().getTime()
      }).save();
      res.send(wiki);
    } catch (error) {
      next(error);
    }
  }
);

export { WikiListRouter };
