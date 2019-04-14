import { TaskBoard } from '../domain/task-board/task-board.domain';
import { getRepository, getConnection, EntityManager } from '../../node_modules/typeorm';
import { TaskBoardEntity } from '../entity/task-board.entity';
import { TaskBoardSetting } from '../domain/task-board/entity/task-board-setting.entity';
import { UserEntity } from '../entity/user.entity';
import { TaskBoardSettingEntity } from '../entity/task-board-setting.entity';

export class TaskBoardRepository {
  constructor() {}

  static async getUserTaskBoards(userId: number): Promise<TaskBoard[]> {
    const taskBoardEntitys = await getRepository(TaskBoardEntity)
      .createQueryBuilder('task_board')
      .leftJoinAndSelect('task_board.setting', 'task_board_setting')
      .where('creatorId = :userId', { userId })
      .getMany();

    return taskBoardEntitys.map((taskBoardEntity: TaskBoardEntity) => {
      const board = new TaskBoard();
      board.id = taskBoardEntity.id;
      board.name = taskBoardEntity.name;
      board.desc = taskBoardEntity.desc;

      const taskBoardSetting = TaskBoardSetting.fromData(taskBoardEntity.setting);

      board.setting = taskBoardSetting;

      return board;
    });
  }

  static async getTaskBoard(id: string): Promise<TaskBoard> {
    const taskBoardEntity: TaskBoardEntity = await getRepository(TaskBoardEntity)
      .createQueryBuilder('task_board')
      .leftJoinAndSelect('task_board.setting', 'task_board_setting')
      .leftJoinAndSelect('task_board.creator', 'user')
      .where('task_board.id = :id', { id })
      .getOne();

    const board = new TaskBoard();
    board.id = taskBoardEntity.id;
    board.name = taskBoardEntity.name;
    board.desc = taskBoardEntity.desc;
    board.creatorId = taskBoardEntity.creator.id;

    const taskBoardSetting = TaskBoardSetting.fromData(taskBoardEntity.setting);

    board.setting = taskBoardSetting;

    return board;
  }

  static async saveTaskBoard(taskBoard: TaskBoard): Promise<void> {
    const creator = new UserEntity();
    creator.id = taskBoard.creatorId;

    await getConnection().transaction(async (transactionalEntityManager: EntityManager) => {
      const taskBoardSettingEntity = new TaskBoardSettingEntity();

      await transactionalEntityManager.save(taskBoardSettingEntity);

      const taskBoardEntity = new TaskBoardEntity();
      taskBoardEntity.name = taskBoard.name;
      taskBoardEntity.desc = taskBoard.desc;
      taskBoardEntity.creator = creator;
      taskBoardEntity.owner = creator;
      taskBoardEntity.setting = taskBoardSettingEntity;

      await transactionalEntityManager.save(taskBoardEntity);
    });
  }

  static async updateBoardSetting(setting: TaskBoardSetting): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(TaskBoardSettingEntity)
      .set({
        showType: setting.showType,
        cover: setting.cover
      })
      .where('id = :id', { id: setting.id })
      .execute();
  }
}
