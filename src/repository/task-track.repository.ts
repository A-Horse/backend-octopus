import { getRepository } from '../../node_modules/typeorm';
import { TaskTrackEntity } from '../entity/task-track.entity';
import { TaskTrack } from '../domain/task-track/task-track.domain';

export class TaskTrackRepository {
  constructor() {}

  static async getTracks(boardId: string): Promise<TaskTrack[]> {
    const trackEntitys: TaskTrackEntity[] = await getRepository(TaskTrackEntity)
    .createQueryBuilder('task_track')
    .where('boardId = :boardId', { boardId })
    .getMany();

    return trackEntitys.map((trackEntity: TaskTrackEntity) => {
        const track = new TaskTrack();
        track.id = trackEntity.id;
        track.name= trackEntity.name;
        track.type = trackEntity.type;
        track.status = trackEntity.status;
        track.order = trackEntity.order;
        track.createdAt = trackEntity.createdAt;
        track.updatedAt = trackEntity.updatedAt;

        return track;
    });
  }
}
