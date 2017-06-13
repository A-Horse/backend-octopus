import express from'express';
import {User, UserModel} from '../model/user';
import {AccessLimitError, NotFoundError} from '../service/error';
import {authJwt} from './middle/jwt';
import {signJwt} from '../service/auth';
import {makeGravatarUrl} from '../service/gravator.js';
import {validateRequest} from '../service/validate';
import { validate } from './middle/check';
import {JWT_KEY} from '../constant';
import bcrypt from 'bcryptjs';

const UserRouter = express.Router();

UserRouter.get('/alive', (req, res) => {
  res.json({status: 'alive'});
});

UserRouter.get('/user/:id/avator', (req, res, next) => {
  const {id} = req.params;
  UserModel({id}).fetch().then(user => {
    if (!user) throw new NotFoundError();
    res.send({result: makeGravatarUrl(user.email)});
  }).catch(next);
});

UserRouter.get('/signin', authJwt, (req, res, next) => {
  res.status(200).send(req.jw.user);
});

UserRouter.post('/logout', authJwt, (req, res) => {
  res.status(204).send();
});

UserRouter.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const creds = {email: email, password: password};
    const user = await User.authUser(creds);
    if (!user) return res.status(401).send();
    return res.send({
      jwt: signJwt({user: user}),
      user: user
    });
  } catch (error) {
    next(error);
  }
});

UserRouter.post('/user/update-password', authJwt, validate({
  oldPassword: ['required'],
  confirmPassword: ['required']
}), (req, res, next) => {
  try {
    const { jw } = req;
    UserModel.where(R.omit('password', queryInfo))
      .fetch()
      .then((user) => {
        if( !user ){
          return resolve(null);
        }
        bcrypt.compare(queryInfo.password, user.get('password'), (error, res) => {
          if (error) return reject(error);
          if (res === true) {
            return resolve(user.omit('password'));
          };
          resolve(null);
        });
      });

  } catch (error) {
    next(error);
  }
});

UserRouter.post('/signup', (req, res, next) => {
  validateRequest(req.body, 'username', ['required']);
  validateRequest(req.body, 'password', ['required']);
  validateRequest(req.body, 'email', ['required']);

  const {username, password, email} = req.body;

  User.createUser({
    username,
    password,
    email
  }).then((user) => {
    user.save().then((user) => {
      const json = user.omit('password');
      const token = signJwt({user: json});

      res.header(JWT_KEY, token);
      res.status(201).send(json);
    });
  }).catch(next);
});

export {UserRouter};
