import { KanbanRepository } from './kanban-repository';
import { Kanban } from './kanban';


export class kanbanApplicationService {
    constructor() {}


    static getProjectKanbans(projectId: string): Promise<Kanban[]> {
        return KanbanRepository.getProjectKanbans(projectId);
    }
    
}