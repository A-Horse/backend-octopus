'use strict';

let jwt = require('jsonwebtoken');

import {JWTs_SECRET} from '../setting';

export function signJwt(json) {
  return jwt.sign({user: json}, JWTs_SECRET);
}
