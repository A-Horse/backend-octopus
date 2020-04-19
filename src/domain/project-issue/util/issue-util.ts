import * as _ from 'lodash';
import { ProjectIssue } from '../project-issue';
import { ProjectIssueDetail } from '../project-issue-detail';

// 适配器的逻辑渗透进来，这个应该放到 service 上做
export function setPartialIssueData(projectIssue: ProjectIssue, partialIssueData: any): void {
  const keys = Object.keys(partialIssueData);

  const [detailFields, issueFields] = _.partition(keys, key => {
    return key === 'content';
  });

  if (detailFields.length && !projectIssue.getDetail()) {
    projectIssue.setDetail(new ProjectIssueDetail({ issueId: projectIssue.id }));
  }

  detailFields.forEach((key: string) => {
    projectIssue.getDetail()[key] = partialIssueData[key];
  });

  issueFields.forEach((key: string) => {
    projectIssue[key] = partialIssueData[key];
  });
}
