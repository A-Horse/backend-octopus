import express from'express';
import {AccessLimitError, NotFoundError} from '../service/error';
import {authJwt} from './middle/jwt';
import {checkIsEmailIdentity} from '../util';
import R from 'ramda';
import bluebird from "bluebird";


import fs from 'fs';
import md5 from 'blueimp-md5';
const pfs = bluebird.promisifyAll(fs);

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

const FileRouter = express.Router();

FileRouter.post('/file', multipartMiddleware, (req, res, next) => {
  const imageURLData = req.body.playload.replace(/^data:image\/\w+;base64,/, '');
  const hash = md5(imageURLData + Date.now()).substring(0, 20);
  const filename = R.compose(R.join('-'), R.splitEvery(5))(hash);
  fs.writeFile(filename, imageURLData, 'base64', function(err) {
    res.json({hi: 'hi'});
  });
});

export {FileRouter};
