import { PROJECT_CARD_ORDER_INIT_INTERVAL } from './../project-card/constant';
import { ProjectCard } from './../project-card/project-card';
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

  static async rankCard({ cardId, targetCardId, isBefore }): Promise<number> {
    console.log('-----------------');
    console.log(cardId, targetCardId, isBefore);
    const card = await ProjectCardRepository.getCard(cardId);
    const targetCard = await ProjectCardRepository.getCard(targetCardId);

    let targetOrderInKanban: number;
    if (isBefore) {
      targetOrderInKanban = await targetCard.calcPreviousOrderInKanban();
      if (targetOrderInKanban === null) {
        targetOrderInKanban =
          (await ProjectCardRepository.getMinOrderInKanban(card.kanbanId)) -
          PROJECT_CARD_ORDER_INIT_INTERVAL;
      }
    } else {
      targetOrderInKanban = await targetCard.calcNextOrderInKanban();
      if (targetOrderInKanban === null) {
        targetOrderInKanban =
          (await ProjectCardRepository.getMaxOrderInKanban(card.kanbanId)) +
          PROJECT_CARD_ORDER_INIT_INTERVAL;
      }
    }

    card.orderInKanban = targetOrderInKanban;
    await ProjectCardRepository.updateCardOrderInKanban(card);
    return card.orderInKanban;
  }
}
