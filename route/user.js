import express from 'express';
import { User, UserModel } from '../model/user';
import { AccessLimitError, NotFoundError } from '../service/error';
import { authJwt } from './middle/jwt';
import { signJwt } from '../service/auth';
import { makeGravatarUrl } from '../service/gravator.js';
import { validateRequest } from '../service/validate';
import { validate } from './middle/check';
import { JWT_KEY } from '../constant';
import R from 'ramda';

const UserRouter = express.Router();

UserRouter.get('/alive', (req, res) => {
  res.json({ status: 'alive' });
});

UserRouter.get('/user/:id/avator', (req, res, next) => {
  const { id } = req.params;
  UserModel({ id })
    .fetch()
    .then(user => {
      if (!user) throw new NotFoundError();
      res.send({ result: makeGravatarUrl(user.email) });
    })
    .catch(next);
});

UserRouter.get('/user/identify', authJwt, (req, res, next) => {
  res.status(200).send(req.jw.user);
});

UserRouter.get('/user/:userId', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const user = await UserModel.where({ id: jw.user.id }).fetch();
    if (!user) return res.status(401).send();
    return res.send({
      jwt: signJwt({ user: user.omit('password') })
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.post('/logout', authJwt, (req, res) => {
  res.status(204).send();
});

UserRouter.post('/signin', async (req, res, next) => {
  // TODO expries time
  try {
    const { email, password } = req.body;
    const creds = {
      email: email.toLowerCase().trim(),
      password: password.trim()
    };
    const user = await User.authUser(creds);
    if (!user) return res.status(401).send();
    return res.send({
      jwt: signJwt({ user: user }),
      user: user
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.post(
  '/user/update-password',
  authJwt,
  validate({
    oldPassword: ['required'],
    newPassword: ['required']
  }),
  async (req, res, next) => {
    try {
      const { jw } = req;
      const authed = await UserModel.authUser(jw.user.id, req.body.oldPassword);
      if (authed) {
        await UserModel.forge({ id: jw.user.id }).updatePassword(
          req.body.newPassword
        );
        return res.status(204).send();
      }
      throw new AccessLimitError();
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.patch('/user/:userId', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const data = R.pick(['username'], req.body);
    const user = await UserModel.forge({ id: jw.user.id }).save(data);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

UserRouter.post('/signup', (req, res, next) => {
  validateRequest(req.body, 'username', ['required']);
  validateRequest(req.body, 'password', ['required']);
  validateRequest(req.body, 'email', ['required']);

  const { username, password, email } = req.body;
  User.createUser({
    username,
    password,
    email
  })
    .then(user => {
      user.save().then(user => {
        const json = user.omit('password');
        const token = signJwt({ user: json });

        res.header(JWT_KEY, token);
        res.status(201).send(json);
      });
    })
    .catch(next);
});

export { UserRouter };
