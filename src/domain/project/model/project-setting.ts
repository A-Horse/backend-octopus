import { ProjectSettingEntity } from '../../../entity/project-setting.entity';
import * as _ from 'lodash';

export class ProjectSetting {
  public id: string;
  public cover: string;
  public isStar: boolean;
  public defaultKanbanId: string;

  public get coverUrl() {
    return `/${this.cover}`
  }  

  constructor({
    id,
    cover,
    defaultKanbanId,
    isStar
  }: {
    id?: string;
    cover?: string;
    defaultKanbanId?: string;
    isStar?: boolean;
  }) {
    this.id = id;
    this.cover = cover;
    this.isStar = isStar;
    this.defaultKanbanId = defaultKanbanId;
  }

  static fromDataEntity(dataEntity: ProjectSettingEntity): ProjectSetting {
    return new ProjectSetting({
      id: dataEntity.id,
      cover: dataEntity.cover,
      defaultKanbanId: _.get(dataEntity, ['defaultKanban', 'id'], null),
      isStar: dataEntity.isStar
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
