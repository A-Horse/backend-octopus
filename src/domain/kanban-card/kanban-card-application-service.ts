import { KanbanCardRepository } from './kanban-card-repository';
import { KanbanCard } from './kanban-card';
import { CreateProjectCardInput } from '../../typing/kanban-card.typing';

export class KanbanCardApplicationService {
  static async getColumnCards({ kanbanId, columnId }): Promise<KanbanCard[]> {
    return KanbanCardRepository.getColumnCards(columnId);
  }

  static async createCard(createProjectCardInput: CreateProjectCardInput) {
    const card = new KanbanCard({
      id: null,
      title: createProjectCardInput.title,
      content: createProjectCardInput.content,
      type: createProjectCardInput.type,
      creatorId: createProjectCardInput.creatorId,
      assigneeId: createProjectCardInput.assigneeId,
      columnId: createProjectCardInput.columnId,
      order: null,
      createdAt: undefined,
      updatedAt: undefined
    });

    return KanbanCardRepository.saveKanbanCard(card);
  }
}
