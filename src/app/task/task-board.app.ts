import { TaskBoard } from '../../domain/task-board/task-board.domain';
import { TaskBoardSetting } from '../../domain/task-board/entity/task-board-setting.entity';
import { TaskBoardRepository } from '../../repository/task-board.repository';
import {
  ITaskBoard,
  ITaskBoardSetting,
  TaskBoardShowType
} from '../../typing/task-board.typing';
import { FileService } from '../../service/file.service';

export function createTaskBoard(
  creatorId: number,
  name: string,
  desc: string = '',
  showType: TaskBoardShowType = TaskBoardShowType.COLUMN
): TaskBoard {
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

export async function getTaskBoardSetting(
  boardId: string,
  userId: number
): Promise<ITaskBoardSetting> {
  const board: TaskBoard = await TaskBoardRepository.getTaskBoard(boardId);

  if (userId !== board.creatorId) {
    throw new Error('NO_PERMISSION');
  }

  return board.getSettingValue();
}

export async function getTaskBoardFromUser(
  id: string,
  userId: number
): Promise<ITaskBoard> {
  const board: TaskBoard = await TaskBoardRepository.getTaskBoard(id);

  if (userId !== board.creatorId) {
    throw new Error('NO_PERMISSION');
  }

  await board.load();
  return board.getValueWithAllData();
}

export async function updateTaskBoardCover(
  coverBase64: string,
  boardId: string
): Promise<string> {
  const filename: string = await FileService.saveBase64Image(coverBase64);

  const board: TaskBoard = await TaskBoardRepository.getTaskBoard(boardId);
  await board.setBoardCover(filename);
  return filename;
}
