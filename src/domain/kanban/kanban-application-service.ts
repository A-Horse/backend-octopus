import { KanbanColumnRepository } from './../kanban-column/kanban-column-repository';
import { KanbanRepository } from './kanban-repository';
import { Kanban } from './kanban';

export class kanbanApplicationService {
  constructor() {}

  static getProjectKanbans(projectId: string): Promise<Kanban[]> {
    return KanbanRepository.getProjectKanbans(projectId);
  }

  static async getKanbanDetail(kanbanId: string): Promise<any> {
    const kanban: Kanban = await KanbanRepository.getKanban(kanbanId);
    
    const kanbanColumns = await KanbanColumnRepository.getKanbanColumns(kanbanId);

    return {
      ...kanban.toJSON,
      columns: kanbanColumns.map(k => k.toJSON)
    }
  }
}
