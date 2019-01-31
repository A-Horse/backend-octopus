import { Todo } from '../../entity/todo.entity';
import { getRepository } from 'typeorm';

export async function getUserDefaultTodos({ userId, limit, offset }): Promise<Todo[]> {
  return await getRepository(Todo)
    .createQueryBuilder('todo')
    .where('todo.creatorId = :creatorId AND isDelete = false', { creatorId: userId })
    .orderBy('todo.updatedAt', 'DESC')
    .limit(limit)
    .offset(offset)
    .getMany();
}
