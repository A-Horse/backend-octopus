'use strict';

let express = require('express'),
    jwt = require('jsonwebtoken'),
    UserRouter = express.Router();

import {User} from '../model/user';

import {JWTs_SECRET} from '../setting';

UserRouter.get('/login', (req, res, next) => {
  res.send('valar morghulis');
});

UserRouter.put('/login', (req, res, next) => {
  let username = req.body.username,
      password = req.body.password;
  
  res.send({id_token: '1024'});
});

UserRouter.post('/sign-up', (req, res, next) => {
  let {username, password} = req.body;
  User.createUser({
    username,
    password
  }).then((user) => {
    user.save().then((user) => {
      const json = user.omit('password');
      const token = jwt.sign({user: json}, JWTs_SECRET);
      res.header('jwts-token', token);
      
      res.status(201)
        .send(json);
    });
  });
});



export {UserRouter};
