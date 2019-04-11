import { TaskBoard } from "../../domain/task-board/task-board.domain";
import { TaskBoardSetting } from "../../domain/task-board/entity/task-board-setting.entity";
import { TaskBoardRepository } from "../../repository/task-board.repository";


export function createTaskBoard(creatorId: number, name: string, desc: string = ''): TaskBoard {
    const taskBoard = new TaskBoard();
    taskBoard.creatorId = creatorId;
    taskBoard.name = name;
    taskBoard.desc = desc;

    const setting = new TaskBoardSetting();

    taskBoard.setting = setting;
    
    return taskBoard;
};

export async function saveTaskBoard(taskBoard: TaskBoard): Promise<void> {
    await TaskBoardRepository.saveTaskBoard(taskBoard);
}

export async function  getUserTaskBoards(userId: number): Promise<TaskBoard[]> {
    return await TaskBoardRepository.getUserTaskBoards(userId);
}