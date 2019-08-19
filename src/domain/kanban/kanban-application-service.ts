import { KanbanSetting } from './kanban-setting';
import { KanbanRepository } from './kanban-repository';
import { Kanban } from './kanban';

export class kanbanApplicationService {
  constructor() {}

  static getProjectKanbans(projectId: string): Promise<Kanban[]> {
    return KanbanRepository.getProjectKanbans(projectId);
  }

  static createProjectKanban(kanbanData: any) {
    const project = new Kanban({
      id: kanbanData.id,
      name: kanbanData.name,
      desc: kanbanData.desc,
      type: kanbanData.type,
      creatorId: kanbanData.creatorId,
      updatedAt: null,
      createdAt: null,
      setting: new KanbanSetting({
        id: null
      })
    });
    return KanbanRepository.savekanban(project);
  }
}
