import { KanbanColumnRepository } from './../kanban-column/kanban-column-repository';
import { KanbanRepository } from './kanban-repository';
import { Kanban } from './kanban';
import { ProjectCardRepository } from '../project-card/kanban-card-repository';

export class kanbanApplicationService {
  static getProjectKanbans(projectId: string): Promise<Kanban[]> {
    return KanbanRepository.getProjectKanbans(projectId);
  }

  static async getKanbanDetail(kanbanId: string): Promise<any> {
    const kanban: Kanban = await KanbanRepository.getKanban(kanbanId);

    const kanbanColumns = await KanbanColumnRepository.getKanbanColumns(kanbanId);

    return {
      ...kanban.toJSON(),
      columns: kanbanColumns.map(k => k.toJSON())
    };
  }

  static async rankCard({ cardId, targetCardId, isBefore }): Promise<void> {
    const card = await ProjectCardRepository.getCard(cardId);
    const targetCard = await ProjectCardRepository.getCard(targetCardId);

    let targetOrderInKanban: number;
    if (isBefore) {
      targetOrderInKanban = await targetCard.calcPreviousOrderInKanban();
    } else {
      targetOrderInKanban = await targetCard.calcNextOrderInKanban();
    }

    card.orderInKanban = targetOrderInKanban;
    await ProjectCardRepository.updateCardOrderInKanban(card);
  }
}
