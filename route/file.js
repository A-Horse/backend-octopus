import express from'express';
import {AccessLimitError, NotFoundError} from '../service/error';
import {authJwt} from './middle/jwt';
import {checkIsEmailIdentity} from '../util';

import fs from 'fs';
import md5 from 'blueimp-md5';

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const FileRouter = express.Router();

FileRouter.post('/file', multipartMiddleware, (req, res, next) => {
  const image = req.body.playload.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFile('hi', image, 'base64', function(err) {

    res.json({hi: 'hi'});
  });
});

export {FileRouter};
