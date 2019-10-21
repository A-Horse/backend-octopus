import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'project_issue_detail'
})
export class ProjectIssueDetailEntity {
  @PrimaryColumn()
  public issueId: string;

  @Column({
    nullable: true
  })
  public content: string;
}
