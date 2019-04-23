// import { GroupModel } from '../../model/group';
import { AccessLimitError, NotFoundError } from '../../service/error';

// TODO
// export async function taskBoardGroupForBody(req, res, next) {
//   const { jw } = req;
//   const { taskBoardId } = req.body;
//   try {
//     const access = await GroupModel.where({
//       taskBoardId,
//       userId: jw.user.id
//     });
//     if (access) {
//       return next();
//     }
//   } catch (error) {
//     throw new AccessLimitError('can access this task wall');
//   }
// }

// export async function taskBoardGroupForParams(req, res, next) {
//   const { jw } = req;
//   const { boardId } = req.params;
//   try {
//     const access = await GroupModel.where({
//       taskBoardId: boardId,
//       userId: jw.user.id
//     });
//     if (access) {
//       return next();
//     }
//   } catch (error) {
//     throw new AccessLimitError('can access this task wall');
//   }
// }
