import { TaskBoard } from '../../domain/task-board/task-board.domain';
import { TaskBoardSetting } from '../../domain/task-board/entity/task-board-setting.entity';
import { TaskBoardRepository } from '../../repository/task-board.repository';
import { ITaskBoard, ITaskBoardSetting } from '../../typing/task-board.typing';

export function createTaskBoard(creatorId: number, name: string, desc: string = ''): TaskBoard {
  const taskBoard = new TaskBoard();
  taskBoard.creatorId = creatorId;
  taskBoard.name = name;
  taskBoard.desc = desc;

  const setting = new TaskBoardSetting();

  taskBoard.setting = setting;

  return taskBoard;
}

export async function saveTaskBoard(taskBoard: TaskBoard): Promise<void> {
  await TaskBoardRepository.saveTaskBoard(taskBoard);
}

export async function getUserTaskBoards(userId: number): Promise<ITaskBoard[]> {
  return (await TaskBoardRepository.getUserTaskBoards(userId)).map(b => b.getValue());
}

export async function getTaskBoardSetting(boardId: string, userId: number): Promise<ITaskBoardSetting> {
  const board: TaskBoard = await TaskBoardRepository.getTaskBoard(boardId);

  if (userId !== board.creatorId) {
    throw new Error('NO_PERMISSION');
  }

  return board.getSettingValue();
}

export async function getTaskBoardFromUser(id: string, userId: number): Promise<ITaskBoard> {
  const board: TaskBoard = await TaskBoardRepository.getTaskBoard(id);

  if (userId !== board.creatorId) {
    throw new Error('NO_PERMISSION');
  }

  await board.load();
  return board.getValueWithAllData();
}
