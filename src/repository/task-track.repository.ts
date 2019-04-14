import { getRepository } from '../../node_modules/typeorm';
import { TaskTrackEntity } from '../entity/task-track.entity';
import { TaskTrack } from '../domain/task-track/task-track.domain';
import { UserEntity } from '../entity/user.entity';
import { TaskBoardEntity } from '../entity/task-board.entity';

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
      track.name = trackEntity.name;
      track.type = trackEntity.type;
      track.status = trackEntity.status;
      track.order = trackEntity.order;
      track.createdAt = trackEntity.createdAt;
      track.updatedAt = trackEntity.updatedAt;

      return track;
    });
  }

  static async getTrackCountInBoard(boardId: string): Promise<number> {
    return await getRepository(TaskTrackEntity)
      .createQueryBuilder('task_track')
      .where('boardId = :boardId', { boardId })
      .getCount();
  }

  static async saveTrack(track: TaskTrack, { userId, boardId }): Promise<TaskTrack> {
    const creatorEntity = new UserEntity();
    creatorEntity.id = userId;
    const boardEntity = new TaskBoardEntity();
    boardEntity.id = boardId;

    const trackEntity: TaskTrackEntity = new TaskTrackEntity();
    trackEntity.name = track.name;
    trackEntity.desc = track.desc;
    trackEntity.creator = creatorEntity;
    trackEntity.board = boardEntity;
    trackEntity.order = track.order;

    await getRepository(TaskTrackEntity).save(trackEntity);

    track.id = trackEntity.id;
    track.createdAt = trackEntity.createdAt;
    track.updatedAt = trackEntity.updatedAt;
    track.status = trackEntity.status;
    track.type = trackEntity.type;

    return track;
  }
}
