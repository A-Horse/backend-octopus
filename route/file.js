import express from'express';
import {AccessLimitError, NotFoundError} from '../service/error';
import {authJwt} from './middle/jwt';
import {checkIsEmailIdentity} from '../util';
import R from 'ramda';
import {hashFileName} from '../service/file';


var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
import {saveImage} from '../service/storage';
const FileRouter = express.Router();

FileRouter.post('/file', multipartMiddleware, async (req, res, next) => {
  const imageURLData = req.body.playload.replace(/^data:image\/\w+;base64,/, '');
  const filename = hashFileName(imageURLData);
  try {
    await saveImage(filename, 'board-cover', imageURLData);
    res.json({hi: 'hi'});
  } catch (error) {
    console.log(error.stack);
    next(error);
  }
});

export {FileRouter};
