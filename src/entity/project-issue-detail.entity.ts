import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity({
  name: 'project_issue_detail'
})
export class ProjectIssueDetailEntity {
  @PrimaryColumn()
  public cardId: string;

  @Column({
    nullable: true
  })
  public content: string;
}
