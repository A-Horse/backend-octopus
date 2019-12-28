import { ErrorParamsError, NotFoundError } from '../../service/error';
import { instanceofNoAuthError } from '../../exception/un-authority.exception';
import { instanceofAccessLimitException } from '../../exception/access-limit.exception';

export function StatusErrorHandleMiddle(error, req, res, next) {
  console.error(error);
  if (error instanceof ErrorParamsError) {
    return res.status(400).send({ message: error.message });
  }
  if (instanceofAccessLimitException(error)) {
    return res.status(422).send({ message: error.message });
  }
  if (instanceofNoAuthError(error)) {
    return res.status(401).send({ message: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send({ message: error.message });
  } else {
    console.log('un catch express error:');
    console.error(error.message);
    return res.status(500).send({ message: '服务器错误!' });
  }
}
