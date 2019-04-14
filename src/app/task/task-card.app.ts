import { CreateTaskCardInput, ITaskCard } from '../../typing/task-card.typing';
import { TaskCard } from '../../domain/task-card/task-card.domain';
import { TaskCardRepository } from '../../repository/task-card.repository';

export async function createTaskCard(createCardInput: CreateTaskCardInput): Promise<ITaskCard> {
  const card = new TaskCard();

  card.title = createCardInput.title;
  card.type = createCardInput.type;
  card.trackId = createCardInput.trackId;

  await card.queryAndSetOrder();

  const savedCard: TaskCard = await TaskCardRepository.saveCard(card, {
    creatorId: createCardInput.creatorId,
    trackId: createCardInput.trackId
  });

  return savedCard.getValue();
}
