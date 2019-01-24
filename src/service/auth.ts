import * as jwt from 'jsonwebtoken';
import { configure } from '../configure';

export function signJwt(user) {
  return jwt.sign(
    {
      user,
      exp: Math.floor(Date.now() / 1000) + configure.getConfig().JWT_EXP_HOURS * 60 * 60
    },
    configure.getConfig().SERCET_KEY
  );
}

export function unsignJwt(token: string) {
  return jwt.verify(token, configure.getConfig().SERCET_KEY);
}

