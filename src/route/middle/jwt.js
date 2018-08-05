import { unsignJwt } from '../../service/auth';
import { AccessLimitError } from '../../service/error';

// TODO move to auth
export function authJwt(req, res, next) {
  const jwtdata = req.header('jwt-token');

  if (!jwtdata) {
    throw new AccessLimitError();
  }
  try {
    req.jw = unsignJwt(jwtdata);
  } catch (error) {
    throw new AccessLimitError();
  }

  if (!!req.params.userId && req.jw.user.id !== +req.params.userId) {
    throw new AccessLimitError();
  }
  return next();
}
