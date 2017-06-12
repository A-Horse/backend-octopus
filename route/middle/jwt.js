import {unsignJwt} from '../../service/auth';

import {JWT_STORAGE_KEY} from '../../setting';
import { GroupModel } from '../../model/group';
import { AccessLimitError, NotFoundError } from '../../service/error';

export function authJwt(req, res, next) {
  let jwtdata = req.header(JWT_STORAGE_KEY);

  if( !jwtdata ){
    return res.status(401).send({message: 'Unauthorized'});
  }
  req.jw = unsignJwt(jwtdata);
  return next();
}
