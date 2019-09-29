import { KanbanColumnRepository } from '../kanban-column/kanban-column-repository';
import { PROJECT_CARD_ORDER_INIT_INTERVAL } from '../project-issue/constant';
import { ProjectIssueRepository } from '../project-issue/project-issue-repository';
import { ProjectCard } from '../project-issue/project-issue';
import { Kanban } from './kanban';
import { KanbanRepository } from './kanban-repository';

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

  // TODO move in to kanban
  static async rankCard({ cardId, targetCardId, isBefore }): Promise<number> {
    const card = await ProjectIssueRepository.getCard(cardId);
    const targetCard = await ProjectIssueRepository.getCard(targetCardId);

    let targetOrderInKanban: number;
    if (isBefore) {
      targetOrderInKanban = await targetCard.calcPreviousOrderInKanban();

      if (targetOrderInKanban === null) {
        card.orderInKanban =
          (await ProjectIssueRepository.getMinOrderInKanban(card.kanbanId)) -
          PROJECT_CARD_ORDER_INIT_INTERVAL;
      } else {
        card.orderInKanban = targetCard.orderInKanban - Math.abs(card.orderInKanban - targetOrderInKanban) / 2;
      }

    } else {
      targetOrderInKanban = await targetCard.calcNextOrderInKanban();
      if (targetOrderInKanban === null) {
        card.orderInKanban =
          (await ProjectIssueRepository.getMaxOrderInKanban(card.kanbanId)) +
          PROJECT_CARD_ORDER_INIT_INTERVAL;
      } else {
        card.orderInKanban = targetCard.orderInKanban + Math.abs(card.orderInKanban - targetOrderInKanban) / 2;
      }

    }

    await ProjectIssueRepository.updateCardOrderInKanban(card);
    return card.orderInKanban;
  }
}
