import express from'express';
import {User, UserModel} from '../model/user';
import {AccessLimitError, NotFoundError} from '../service/error';
import {authJwt} from './middle/jwt';
import {signJwt} from '../service/auth';
import {checkIsEmailIdentity} from '../util';
import {makeGravatarUrl} from '../service/gravator.js';

const UserRouter = express.Router();

UserRouter.get('/user', authJwt, (req, res) => {
  const {search} = req.query;
  if( checkIsEmailIdentity(search) ){
    
  } else {
    // User.
  }
});

UserRouter.get('/user/:id/avator', (req, res, next) => {
  const {id} = req.params;
  UserModel({id}).fetch().then(user => {
    if (!user) throw new NotFoundError();
    res.send({result: makeGravatarUrl(user.email)});
  }).catch(next);
});

UserRouter.get('/login', authJwt, (req, res, next) => {
  res.status(200).send(req.jw.user);
});

UserRouter.post('/logout', authJwt, (req, res) => {
  
});

UserRouter.post('/login', (req, res, next) => {
  const email = req.body.email,
      password = req.body.password;

  if (!email && !password) {
    return res.status(400).send();
  }
  
  const creds = {email: email, password: password};
  
  User.authUser(creds).then(user => {
    if( !user ){
      return res.status(401).send();
    }
    return res.send({
      jwt: signJwt({user: user}),
      user: user
    });
  }).catch(error => {
    res.status(500).send();
    throw error;
  });
});

UserRouter.post('/sign-up', (req, res, next) => {
  let {username, password, email} = req.body;
  
  User.createUser({
    username,
    password,
    email
  }).then((user) => {
    user.save().then((user) => {
      let json = user.omit('password');
      const token = signJwt({user: json});
      
      res.header('jwts-token', token);
      res.status(201).send(json);
    });
  }).catch(error => {throw error});
});

export {UserRouter};
