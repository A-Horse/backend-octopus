import {unsignJwt} from '../../service/auth';

import {JWT_STORAGE_KEY} from '../../setting';
import { GroupModel } from '../../model/group';
import { AccessLimitError, NotFoundError } from '../../service/error';

export async function taskBoardGroupForBody(req, res, next) {
  const { jw } = req;
  const { taskBoardId } = req.body;
  const access = await GroupModel.where({
    taskWallId: taskBoardId,
    userId: jw.user.id
  });
  if (access) {
    return next();
  }
  throw new new AccessLimitError('can access this task wall');
}
