import { TaskBoard } from "../domain/task-board/task-board.domain";
import { getRepository } from "../../node_modules/typeorm";
import { TaskBoardEntity } from "../entity/task-board.entity";
import { TaskBoardSetting } from "../domain/task-board/entity/task-board-setting.entity";
import { UserEntity } from "../entity/user.entity";


export class TaskBoardRepository {
    constructor() {}

    getTaskBoardById(boardId: string) {}

    async getUserTaskBoard(userId: string): Promise<TaskBoard[]> {
      const taskBoardEntitys = await getRepository(TaskBoardEntity)
      .createQueryBuilder("task_board")
      .where("creatorId = :userId", { userId: 1 })
      .leftJoinAndSelect('task_board.setttingId', 'task_board_setting')
      .getMany();

      return taskBoardEntitys.map((taskBoardEntity: TaskBoardEntity) => {
        const board = new TaskBoard();
        board.id = taskBoardEntity.id;
        board.name = taskBoardEntity.name;
        board.desc = taskBoardEntity.desc;

        const taskBoardSetting = new TaskBoardSetting();
        taskBoardSetting.id = taskBoardEntity.setting.id;
        taskBoardSetting.showType = taskBoardEntity.setting.showType;
        
        board.setting = taskBoardSetting;

        return board;
      });
    }

    static async saveTaskBoard(taskBoard: TaskBoard): Promise<void> {
        const creator = new UserEntity();
        creator.id = taskBoard.creatorId;

        const taskBoardEntity = new TaskBoardEntity();
        taskBoardEntity.name = taskBoard.name;
        taskBoardEntity.desc = taskBoard.desc;
        taskBoardEntity.creator = creator;
        taskBoardEntity.owner = creator;

        await getRepository(TaskBoardEntity)
        .save(taskBoardEntity);
    }
}

