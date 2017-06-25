import { TodoModel } from '../../model/todo';
import { AccessLimitError } from '../../service/error';

export function authTaskPermissions(req, res, next) {
  return next();
}


export async function taskBoardGroup(req, res, next) {
  const { jw } = req;

};

export async function tdPermissions(req, res, next) {
  try {
    // TODO: todo creater => todo box => if todo box => check todo box group
    const { todoId } = req.params;
    const { jw } = req;
    const todo = await TodoModel.where({id: todoId}).fetch();
    if ( todo.get('userId') === jw.user.id ) {
      return next();
    }
    return next(new AccessLimitError());
  } catch (error) {
    return next(error);
  }
}
