import { getRepository } from '../../node_modules/typeorm';
import { TaskCard } from '../domain/task-card/task-card.domain';
import { TaskCardEntity } from '../entity/task-card.entity';

export class TaskCardRepository {
  constructor() {}

  static async getCardsByTrackId(trackId: string): Promise<TaskCard[]> {
    const cardEntitys: TaskCardEntity[] = await getRepository(TaskCardEntity)
    .createQueryBuilder('task_card')
    .where('trackId = :trackId', { trackId })
    .getMany();

    return cardEntitys.map((cardEntity: TaskCardEntity) => {
        const card = new TaskCard();
        card.id = cardEntity.id;
        card.title= cardEntity.title;
        card.type = cardEntity.type;
        card.status = cardEntity.status;
        card.order = cardEntity.order;
        card.createdAt = cardEntity.createdAt;
        card.updatedAt = cardEntity.updatedAt;

        return card;
    });
  }
}
