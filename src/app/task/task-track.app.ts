import { TaskTrack } from '../../domain/task-track/task-track.domain';
import { CreateTrackInput } from '../../typing/task-track.typing';

export async function createTrack(createTrackInput: CreateTrackInput): Promise<void> {
  const track = new TaskTrack();

  track.name = createTrackInput.name;
  track.desc = createTrackInput.desc;

  await track.queryAndSetLastOrder(createTrackInput.boardId);
}
