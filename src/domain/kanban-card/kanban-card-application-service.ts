import { KanbanCardRepository } from './kanban-card-repository';
import { KanbanCard } from './kanban-card';

export class KanbanCardApplicationService {
  static async getColumnCards({ kanbanId, columnId }): Promise<KanbanCard[]> {
    return KanbanCardRepository.getColumnCards(columnId);
  }
}
