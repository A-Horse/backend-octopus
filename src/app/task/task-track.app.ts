import { TaskTrack } from '../../domain/task-track/task-track.domain';
import { CreateTrackInput } from '../../typing/task-track.typing';
import { TaskTrackRepository } from '../../repository/task-track.repository';

export async function createTrack(createTrackInput: CreateTrackInput): Promise<void> {
  const track = new TaskTrack();

  track.name = createTrackInput.name;
  track.desc = createTrackInput.desc;

  await track.queryAndSetLastOrder(createTrackInput.boardId);

  await TaskTrackRepository.saveTrack(track, {
      userId: createTrackInput.creatorId,
      boardId: createTrackInput.boardId
  });
}
