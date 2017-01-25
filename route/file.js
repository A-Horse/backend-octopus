import express from'express';
import {AccessLimitError, NotFoundError} from '../service/error';
import {authJwt} from './middle/jwt';
import {checkIsEmailIdentity} from '../util';
import R from 'ramda';
import {hashFileName} from '../service/file';
import path from 'path';

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
import {saveImage} from '../service/storage';
const FileRouter = express.Router();

FileRouter.post('/image', multipartMiddleware, async (req, res, next) => {
  const imageURLData = req.body.playload.replace(/^data:image\/\w+;base64,/, '');
  const filename = hashFileName(imageURLData);
  try {
    // TODO extract 'board-cover' variable
    await saveImage(filename, 'board-cover', imageURLData);
    res.json({image: path.join('board-cover', filename)});
  } catch (error) {
    next(error);
  }
});

export {FileRouter};
