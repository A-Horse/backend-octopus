import {ErrorParamsError} from '../../service/error';

export function StatusErrorHandleMiddle(error, req, res, next) {
  if( error instanceof ErrorParamsError ){
    return res.status(400).send({message: error.message});
  } else {
    return next(error);
  }
}
