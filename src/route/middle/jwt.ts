import { authServive } from '../../service/auth.service';
import { NoAuthError } from "../../exception/no-auth.error";

// TODO move to auth
export function authJwt(req, res, next) {
  // TODO rename app-authxxx
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
