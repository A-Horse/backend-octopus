'use strict';

let express = require('express'),
    UserRouter = express.Router();

UserRouter.get('/login', (req, res, next) => {
  res.send('valar morghulis');
});

UserRouter.put('/login', (req, res, next) => {
  let username = req.body.username,
      password = req.body.password;
  console.log(username);
  console.log(password);
  res.status(200);
  res.send({id_token: '1024'});
});

export {UserRouter};
