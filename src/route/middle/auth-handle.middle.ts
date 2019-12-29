import { authServive } from '../../service/auth.service';
import { UnAuthority } from '../../exception/un-authority.exception';

// TODO move to auth
export function authorizedRequestMiddle(req, res, next) {
  // TODO rename app-authxxx
  const jwtdata = req.header('jwt-token');

  if (!jwtdata) {
    throw new UnAuthority();
  }
  try {
    req.jw = authServive.unsignJwt(jwtdata);
  } catch (error) {
    throw new UnAuthority();
  }

  if (!!req.params.userId && req.jw.user.id !== +req.params.userId) {
    throw new UnAuthority();
  }
  return next();
}
