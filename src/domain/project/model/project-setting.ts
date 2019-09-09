import { ProjectSettingEntity } from '../../../entity/project-setting.entity';
import * as _ from 'lodash';

export class ProjectSetting {
  private id: string;
  public cover: string;
  public coverUrl: string;
  public isStar: string;
  public defaultKanbanId: string;

  constructor({ id, cover, defaultKanbanId }: {
    id?: string;
    cover?: string;
    defaultKanbanId?: string;
  }) {
    this.id = id;
    this.cover = cover;
    this.defaultKanbanId = defaultKanbanId;
  }

  static fromDataEntity(dataEntity: ProjectSettingEntity): ProjectSetting {
    return new ProjectSetting({
      id: dataEntity.id,
      cover: dataEntity.cover,
      defaultKanbanId: _.get(dataEntity, ['defaultKanban', 'id'], null)
    });
  }

  public toJSON(): any {
    return {
      id: this.id,
      coverUrl: this.coverUrl,
      defaultKanbanId: this.defaultKanbanId
    };
  }
}
