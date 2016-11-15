import {ErrorParamsError, AccessLimitError, NotFoundError} from '../../service/error';

import bunyun from '../../log';

export function StatusErrorHandleMiddle(error, req, res, next) {
  bunyun.error('Route Error: ', error);
  if( error instanceof ErrorParamsError ){
    return res.status(400).send({message: error.message});
  } if (error instanceof AccessLimitError) {
    return res.status(422).send({message: error.message});
  } if (error instanceof NotFoundError) {
    return res.status(404).send({message: error.message});
  } else {
    // TODO log
    console.error(error.message);
    return res.status(500).send({message: '服务器错误!'});
  }
}
