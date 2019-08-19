import { KanbanColumnRepository } from './kanban-column-repository';
import { KanbanColumn } from './kanban-column';
import {
  CreateKanbanColumnInput,
  KanbanColumnId
} from './../../typing/kanban-column.typing';

export class KanbanColumnApplicationService {
  constructor() {}

  static createKanbanColumn(
    createKanbanColumnInput: CreateKanbanColumnInput
  ): Promise<KanbanColumnId> {
    const column = new KanbanColumn({
      id: null,
      name: createKanbanColumnInput.name,
      status: null,
      creatorId: createKanbanColumnInput.creatorId,
      order: null,
      createdAt: null,
      updatedAt: null,
      kanbanId: createKanbanColumnInput.kanbanId
    });

    return KanbanColumnRepository.saveKanbanColumn(column);
  }
}
