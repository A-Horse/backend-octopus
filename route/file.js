import express from'express';
import {AccessLimitError, NotFoundError} from '../service/error';
import {authJwt} from './middle/jwt';
import {checkIsEmailIdentity} from '../util';
import fs from 'fs';

const FileRouter = express.Router();

FileRouter.post('/file', (req, res, next) => {
  console.log('ihihihihihihi--------------');
  console.log(req.body);
  const image = req.body.image.replace('/^data:\/png;base64,/', '');

  fs.writeFile('hi.png', image, 'base64', function(err){
    console.log(err);
    res.json({hi: 'hi'});
  })
});

export {FileRouter};
