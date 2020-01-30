import * as _ from 'lodash';

import { ProjectSettingEntity } from '../../../orm/project-setting.entity';

export class ProjectSetting {
  public id: string;
  public coverBase64Id: string;
  public isStar: boolean;
  public defaultKanbanId: string;

  constructor({
    id,
    coverBase64Id,
    defaultKanbanId,
    isStar
  }: {
    id?: string;
    coverBase64Id?: string;
    defaultKanbanId?: string;
    isStar?: boolean;
  }) {
    this.id = id;
    this.coverBase64Id = coverBase64Id;
    this.isStar = isStar;
    this.defaultKanbanId = defaultKanbanId;
  }

  static fromDataEntity(dataEntity: ProjectSettingEntity): ProjectSetting {
    return new ProjectSetting({
      id: dataEntity.id,
      coverBase64Id: dataEntity.coverBase64Id,
      defaultKanbanId: _.get(dataEntity, ['defaultKanban', 'id'], null),
      isStar: dataEntity.isStar
    });
  }

  public toJSON(): any {
    return {
      id: this.id,
      coverBase64Id: this.coverBase64Id,
      defaultKanbanId: this.defaultKanbanId
    };
  }
}
