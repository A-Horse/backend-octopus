'use strict';

let jwt = require('jsonwebtoken');

import {JWTs_SECRET} from '../../setting';

import {unsignJwt} from '../../service/auth';

export function authJwt(req, res, next) {
  let jwtdata = req.header('jwts-token');
  
  if( !jwt ){
    return res.status(401).send({message: 'Unauthorized'});
  }
  req.jw = unsignJwt(jwtdata);
  return next();
}
