import { TodoModel } from '../../model/todo';

export function authTaskPermissions(req, res, next) {
  return next();
}


export async function taskBoardGroup(req, res, next) {
  const { jw } = req;

};

export async function tdPermissions(req, res, next) {
  // TODO: todo creater => todo box => if todo box => check todo box group
  const { todoId } = req;
}
