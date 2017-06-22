import {unsignJwt} from '../../service/auth';

import {JWT_STORAGE_KEY} from '../../setting';
import { GroupModel } from '../../model/group';
import { AccessLimitError, NotFoundError } from '../../service/error';

// TODO move to auth
export function authJwt(req, res, next) {
  const jwtdata = req.header(JWT_STORAGE_KEY);

  // TODO throw error
  if( !jwtdata ){
    return res.status(401).send({message: 'Unauthorized'});
  }
  req.jw = unsignJwt(jwtdata);
  return next();
}
