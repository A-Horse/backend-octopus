import { stringify } from 'querystring';

import { ProjectSettingEntity } from '../../../entity/project-setting.entity';

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
    console.log(dataEntity);
    return new ProjectSetting({
      id: dataEntity.id,
      cover: dataEntity.cover,
      defaultKanbanId: 'hihi'
    });
  }

  public toJSON(): any {
    return {
      id: this.id,
      coverUrl: this.coverUrl
    };
  }
}
