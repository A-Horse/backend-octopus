import { TaskBoard } from "../domain/task-board/task-board.domain";
import { getRepository } from "../../node_modules/typeorm";
import { TaskBoardEntity } from "../entity/task-board.entity";
import { TaskBoardSetting } from "../domain/task-board/entity/task-board-setting.entity";


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

    public saveTaskBoard(taskBoard: TaskBoard): void {

    }
}
