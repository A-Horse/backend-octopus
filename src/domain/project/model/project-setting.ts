import * as _ from 'lodash';

import { ProjectSettingEntity } from '../../../orm/project-setting.entity';

export class ProjectSetting {
  public id: string;
  public coverFileName: string;
  public isStar: boolean;
  public defaultKanbanId: string;

  constructor({
    id,
    coverFileName,
    defaultKanbanId,
    isStar
  }: {
    id?: string;
    coverFileName?: string;
    defaultKanbanId?: string;
    isStar?: boolean;
  }) {
    this.id = id;
    this.coverFileName = coverFileName;
    this.isStar = isStar;
    this.defaultKanbanId = defaultKanbanId;
  }

  static fromDataEntity(dataEntity: ProjectSettingEntity): ProjectSetting {
    return new ProjectSetting({
      id: dataEntity.id,
      coverFileName: dataEntity.coverFileName,
      defaultKanbanId: _.get(dataEntity, ['defaultKanban', 'id'], null),
      isStar: dataEntity.isStar
    });
  }

  public toJSON(): any {
    return {
      id: this.id,
      coverFileName: this.coverFileName,
      defaultKanbanId: this.defaultKanbanId
    };
  }
}
