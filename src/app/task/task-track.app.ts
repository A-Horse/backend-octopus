import { TaskTrack } from '../../domain/task-track/task-track.domain';
import { CreateTrackInput, ITaskTrack } from '../../typing/task-track.typing';
import { TaskTrackRepository } from '../../repository/task-track.repository';

export async function createTrack(
  createTrackInput: CreateTrackInput
): Promise<ITaskTrack> {
  const track = new TaskTrack();

  track.name = createTrackInput.name;
  track.desc = createTrackInput.desc;
  track.boardId = createTrackInput.boardId;

  await track.queryAndSetLastOrder();

  const savedTrack = await TaskTrackRepository.saveTrack(track, {
    userId: createTrackInput.creatorId,
    boardId: createTrackInput.boardId
  });
  await track.load();

  return savedTrack.getValueWithCards();
}
