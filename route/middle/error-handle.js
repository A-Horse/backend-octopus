import {ErrorParamsError, AccessLimitError, NotFoundError} from '../../service/error';

export function StatusErrorHandleMiddle(error, req, res, next) {
  if( error instanceof ErrorParamsError ){
    return res.status(400).send({message: error.message});
  } if (error instanceof AccessLimitError) {
    return res.status(422).send({message: error.message});
  } if (error instanceof NotFoundError) {
    return res.status(404).send({message: error.message});
  } else {
    return res.status(500).send({message: error.message});
  }
}
