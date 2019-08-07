import { ProjectSetting } from './project-setting';
import { ProjectStatus, ProjectType } from './../../../typing/project.typing';

export class Project {
  constructor() {}

  public id: string;
  public setting: ProjectSetting;
  public name: string;
  public desc: string;
  public type: ProjectType;
  public status: ProjectStatus;
  public creatorId: string;
  public ownerId: string;
  public createdAt: Date;
  public updatedAt: Date;

  public createKanban() {
  }

  public createKanbanCard() {

  }

  
}