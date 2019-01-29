import { NoAuthError } from '../../service/error';
import { authServive } from '../../service/auth.service';

// TODO move to auth
export function authJwt(req, res, next) {
  const jwtdata = req.header('jwt-token');

  if (!jwtdata) {
    throw new NoAuthError();
  }
  try {
    req.jw = authServive.unsignJwt(jwtdata);
  } catch (error) {
    throw new NoAuthError();
  }

  if (!!req.params.userId && req.jw.user.id !== +req.params.userId) {
    throw new NoAuthError();
  }
  return next();
}
