import { AccessLimitError, NotFoundError } from '../../service/error';
import { TaskAccessModel } from '../../model/task-access';
import { Request, Response, NextFunction } from 'express';

export async function taskBoardAuthMiddle(taskBoardId: string, req: Request, res: Response, next: NextFunction) {
  const { jw } = req;
  try {
    const canAccess = await TaskAccessModel.where({
      taskBoardId,
      userId: jw.user.id
    });
    if (canAccess) {
      return next();
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new AccessLimitError('can access this task wall');
  }
}

export function taskBoardParamAuthMiddle(req, res, next) {
  const { taskBoardId } = req.params;
  return taskBoardAuthMiddle(taskBoardId, req, res, next);
}
