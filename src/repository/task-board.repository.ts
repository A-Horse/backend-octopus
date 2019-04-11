import { TaskBoard } from "../domain/task-board/task-board.domain";
import { getRepository, getConnection, EntityManager } from "../../node_modules/typeorm";
import { TaskBoardEntity } from "../entity/task-board.entity";
import { TaskBoardSetting } from "../domain/task-board/entity/task-board-setting.entity";
import { UserEntity } from "../entity/user.entity";
import { TaskBoardSettingEntity } from "../entity/task-boad-setting.entity";


export class TaskBoardRepository {
    constructor() {}

    getTaskBoardById(boardId: string) {}

    static async getUserTaskBoards(userId: number): Promise<TaskBoard[]> {
      const taskBoardEntitys = await getRepository(TaskBoardEntity)
      .createQueryBuilder("task_board")
      .leftJoinAndSelect('task_board.setting', 'task_board_setting')
      .where("creatorId = :userId", { userId })
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

        
       

        

        await getConnection().transaction(async (transactionalEntityManager: EntityManager) => {
          const taskBoardSettingEntity = new TaskBoardSettingEntity();

          await transactionalEntityManager
          .save(taskBoardSettingEntity);


          const taskBoardEntity = new TaskBoardEntity();
        taskBoardEntity.name = taskBoard.name;
        taskBoardEntity.desc = taskBoard.desc;
        taskBoardEntity.creator = creator;
        taskBoardEntity.owner = creator;
        taskBoardEntity.setting = taskBoardSettingEntity;

        await transactionalEntityManager
          .save(taskBoardEntity);

         
    

        });

    }
}

