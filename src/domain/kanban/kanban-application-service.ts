import { CreateKanbanInput, KanbanType } from './../../typing/kanban.typing';
import { KanbanSetting } from './kanban-setting';
import { KanbanRepository } from './kanban-repository';
import { Kanban } from './kanban';

export class kanbanApplicationService {
  constructor() {}

  static getProjectKanbans(projectId: string): Promise<Kanban[]> {
    return KanbanRepository.getProjectKanbans(projectId);
  }

  static createProjectKanban(createKanbanInput: CreateKanbanInput) {
    const project = new Kanban({
      id: null,
      name: createKanbanInput.name,
      desc: createKanbanInput.desc,
      type: KanbanType.NORMAL,
      projectId: createKanbanInput.projectId,
      creatorId: createKanbanInput.creatorId,
      updatedAt: null,
      createdAt: null,
      setting: new KanbanSetting({
        id: null
      })
    });
    return KanbanRepository.savekanban(project);
  }
}
