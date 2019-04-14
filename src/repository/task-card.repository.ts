import { getRepository } from '../../node_modules/typeorm';
import { TaskCard } from '../domain/task-card/task-card.domain';
import { TaskCardEntity } from '../entity/task-card.entity';
import { UserEntity } from '../entity/user.entity';
import { TaskTrackEntity } from '../entity/task-track.entity';

export class TaskCardRepository {
  constructor() {}

  static async saveCard(taskCard: TaskCard, { trackId, creatorId }): Promise<TaskCard> {
    const creator: UserEntity = new UserEntity();
    creator.id = creatorId;

    const taskCardEntity = new TaskCardEntity();
    taskCardEntity.title = taskCard.title;
    taskCardEntity.type = taskCard.type;
    taskCardEntity.order = taskCard.order;

    const trackEntity = new TaskTrackEntity();
    trackEntity.id = trackId;
    
    taskCardEntity.track = trackEntity;

    await getRepository(TaskCardEntity).save(taskCardEntity);

    taskCard.id = taskCardEntity.id;
    taskCard.status = taskCardEntity.status;
    taskCard.type = taskCardEntity.type;
    taskCard.createdAt = taskCardEntity.createdAt;
    taskCard.updatedAt = taskCardEntity.updatedAt;
    
    return taskCard;
  }

  static async getCardsByTrackId(trackId: string): Promise<TaskCard[]> {
    const cardEntitys: TaskCardEntity[] = await getRepository(TaskCardEntity)
      .createQueryBuilder('task_card')
      .where('trackId = :trackId', { trackId })
      .getMany();

    return cardEntitys.map((cardEntity: TaskCardEntity) => {
      const card = new TaskCard();
      card.id = cardEntity.id;
      card.title = cardEntity.title;
      card.type = cardEntity.type;
      card.status = cardEntity.status;
      card.order = cardEntity.order;
      card.createdAt = cardEntity.createdAt;
      card.updatedAt = cardEntity.updatedAt;

      return card;
    });
  }

  static async getCardCountInTrack(trackId: string): Promise<number> {
    return await getRepository(TaskCardEntity)
      .createQueryBuilder('task_card')
      .where('trackId = :trackId', { trackId })
      .getCount();
  }
}
