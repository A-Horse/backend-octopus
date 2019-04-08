import { TaskBoard } from "../domain/task-board/task-board.domain";
import { getRepository } from "../../node_modules/typeorm";
import { TaskBoardEntity } from "../entity/task-board.entity";


export class TaskBoardRepository {
    constructor() {}

    getTaskBoardById(boardId: string) {}

    async getUserTaskBoard(userId: string): Promise<any> {
      const taskBoardEntitys = await getRepository(TaskBoardEntity)
      .createQueryBuilder("task_board")
      .where("creatorId = :userId", { userId: 1 })
      .leftJoinAndSelect('task_board.setttingId', 'task')
      .getMany();

      return taskBoardEntitys.map((taskBoardEntity: TaskBoardEntity) => {
        const board = new TaskBoard();
        board.id = taskBoardEntity.id;
        board.name = taskBoardEntity.name;
        board.desc = taskBoardEntity.desc;


        
      });
    }

    public saveTaskBoard(taskBoard: TaskBoard): void {

    }
}

