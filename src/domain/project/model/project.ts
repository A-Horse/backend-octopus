import { ProjectEntity } from '../../../orm/project.entity';
import { ProjectIssueType } from '../../../typing/kanban-card.typing';
import { CreateKanbanInput } from '../../../typing/kanban.typing';
import { ProjectStatus, ProjectType } from '../../../typing/project.typing';
import { Kanban } from '../../kanban/kanban';
import { KanbanSetting } from '../../kanban/kanban-setting';
import { ProjectRepository } from '../project-repository';
import { ProjectSetting } from './project-setting';

export class Project {
  public id: string;
  public setting: ProjectSetting;
  public name: string;
  public desc: string;
  public type: ProjectType;
  public status: ProjectStatus;
  public creatorId: number;
  public ownerId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    name,
    desc,
    type,
    status,
    creatorId,
    createdAt,
    updatedAt,
    setting
  }) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.status = status;
    this.creatorId = creatorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.setting = setting;
  }

  public createKanban(createKanbanInput: CreateKanbanInput) {
    const kanban = new Kanban({
      id: null,
      name: createKanbanInput.name,
      desc: createKanbanInput.desc,
      type: ProjectIssueType.NORMAL,
      projectId: createKanbanInput.projectId,
      creatorId: createKanbanInput.creatorId,
      updatedAt: null,
      createdAt: null,
      setting: new KanbanSetting({
        id: null
      })
    });
    return kanban;
  }

  public createProjectIssue() {}

  public async setDefaultKanban(kanbanId: string): Promise<void> {
    this.setting.defaultKanbanId = kanbanId;
    await ProjectRepository.updateProjectSetting(this.setting);
  }

  public async setCoverBase64ID(id: number): Promise<void> {
    this.setting.coverBase64Id = id;
    await ProjectRepository.updateProjectSetting(this.setting);
  }

  static fromDataEntity(dataEntity: ProjectEntity): Project {
    const setting = ProjectSetting.fromDataEntity(dataEntity.setting);

    const project = new Project({
      id: dataEntity.id,
      name: dataEntity.name,
      desc: dataEntity.desc,
      type: dataEntity.type,
      status: dataEntity.status,
      creatorId: dataEntity.creator.id,
      updatedAt: dataEntity.updatedAt,
      createdAt: dataEntity.createdAt,
      setting: setting
    });
    return project;
  }

  public toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      type: this.type,
      status: this.status,
      creatorId: this.creatorId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      setting: this.setting.toJSON()
    };
  }
}
