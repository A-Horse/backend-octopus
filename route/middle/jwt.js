import { unsignJwt } from '../../service/auth';

import { JWT_STORAGE_KEY } from '../../setting';
import { GroupModel } from '../../model/group';
import { AccessLimitError, NotFoundError } from '../../service/error';

// TODO move to auth
export function authJwt(req, res, next) {
  const jwtdata = req.header(JWT_STORAGE_KEY);

  if (!jwtdata) {
    throw new AccessLimitError();
  }
  req.jw = unsignJwt(jwtdata);
  if (!!req.params.userId && req.jw.user.id !== +req.params.userId) {
    throw new AccessLimitError();
  }
  return next();
}
