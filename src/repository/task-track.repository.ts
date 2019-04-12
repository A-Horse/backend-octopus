import { TaskBoard } from '../domain/task-board/task-board.domain';
import { getRepository, getConnection, EntityManager } from '../../node_modules/typeorm';
import { TaskBoardEntity } from '../entity/task-board.entity';
import { TaskBoardSetting } from '../domain/task-board/entity/task-board-setting.entity';
import { UserEntity } from '../entity/user.entity';
import { TaskBoardSettingEntity } from '../entity/task-boad-setting.entity';
import { TaskTrackEntity } from '../entity/task-track.entity';

export class TaskBoardRepository {
  constructor() {}

  static async getTracks(boardId: string) {
    await getRepository(TaskTrackEntity)
    .createQueryBuilder('task_track')
    .where('boardId = :boardId', { boardId })
    .getMany();
  }
}
