import * as express from 'express';
import { User, UserModel } from '../model/user';
import { AccessLimitError } from '../service/error';
import { authJwt } from '../route/middle/jwt';
import { signJwt } from '../service/auth';

import { validate } from '../route/middle/check';
import { JWT_KEY } from '../constant';
import * as R from 'ramda';
import { configure } from '../configure';

const UserRouter = express.Router();

UserRouter.get('/:userId', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const user = await UserModel.where({ id: jw.user.id }).fetch();
    if (!user) {
      return res.status(401).send();
    }
    return res.send({
      jwt: signJwt({ user: user.omit('password') })
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.post('/logout', (req, res) => {
  res.status(204).send();
});

UserRouter.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const creds = {
      email: email.toLowerCase().trim(),
      password: password.trim()
    };
    const user = await User.authUser(creds);
    if (!user) {
      return res.status(401).send();
    }
    return res.send({
      jwt: signJwt(user),
      user
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;
  if (configure.getConfig().DISABLE_SIGNUP) {
    return res.status(403).send()
  }
  User.createUser({
    username,
    password,
    email
  })
    .then(user => {
      user.save().then((user: any) => {
        const json = user.omit('password');
        const token = signJwt({ user: json });
        res.header(JWT_KEY, token);
        res.status(201).send(json);
      });
    })
    .catch(next);
});

UserRouter.post(
  '/update-password',
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
        await UserModel.forge({ id: jw.user.id }).updatePassword(req.body.newPassword);
        return res.status(204).send();
      }
      throw new AccessLimitError();
    } catch (error) {
      next(error);
    }
  }
);

UserRouter.patch('/:userId', authJwt, async (req, res, next) => {
  try {
    const { jw } = req;
    const data = R.pick(['username'], req.body);
    const updatedUser = await UserModel.forge({ id: jw.user.id }).save(data);

    const user = await UserModel.where({ id: jw.user.id }).fetch();
    const jwtToken = signJwt({ user: user.omit('password') });

    res.header(JWT_KEY, jwtToken);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

export { UserRouter };
