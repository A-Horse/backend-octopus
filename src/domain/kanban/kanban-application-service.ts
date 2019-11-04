import { KanbanColumnRepository } from '../kanban-column/kanban-column-repository';
import { PROJECT_CARD_ORDER_INIT_INTERVAL } from '../project-issue/constant';
import { ProjectIssueRepository } from '../project-issue/project-issue-repository';
import { ProjectIssue } from '../project-issue/project-issue';
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
    const issue = await ProjectIssueRepository.getIssue(cardId);
    const targetIssue = await ProjectIssueRepository.getIssue(targetCardId);

    if (isBefore) {
      const previousOrderInKanban = await targetIssue.calcPreviousOrderInKanban();

      if (previousOrderInKanban === null) {
        issue.orderInKanban =
          (await ProjectIssueRepository.getMinOrderInKanban(issue.kanbanId)) -
          PROJECT_CARD_ORDER_INIT_INTERVAL;
      } else {
        issue.orderInKanban =
          targetIssue.orderInKanban -
          (targetIssue.orderInKanban - previousOrderInKanban) / 2;
      }
    } else {
      const nextOrderInKanban = await targetIssue.calcNextOrderInKanban();
      if (nextOrderInKanban === null) {
        issue.orderInKanban =
          (await ProjectIssueRepository.getMaxOrderInKanban(issue.kanbanId)) +
          PROJECT_CARD_ORDER_INIT_INTERVAL;
      } else {
        issue.orderInKanban =
          targetIssue.orderInKanban + (nextOrderInKanban - targetIssue.orderInKanban) / 2;
      }
    }

    await ProjectIssueRepository.updateCardOrderInKanban(issue);
    return issue.orderInKanban;
  }
}
