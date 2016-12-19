let jwt = require('jsonwebtoken');

import {JWTs_SECRET} from '../../setting';

import {unsignJwt} from '../../service/auth';

import {JWT_STORAGE_KEY} from '../../setting';

export function authJwt(req, res, next) {
  let jwtdata = req.header(JWT_STORAGE_KEY);
  
  if( !jwtdata ){
    return res.status(401).send({message: 'Unauthorized'});
  }
  req.jw = unsignJwt(jwtdata);
  return next();
}
