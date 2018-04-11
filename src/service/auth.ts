let jwt = require('jsonwebtoken');

import { JWTs_SECRET } from '../setting';

export function signJwt(json) {
  return jwt.sign(json, JWTs_SECRET);
}

export function unsignJwt(token) {
  return jwt.verify(token, JWTs_SECRET);
}
