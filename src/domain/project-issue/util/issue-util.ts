import { ProjectIssue } from '../project-issue';
import * as _ from 'lodash';
import { ProjectIssueDetail } from '../project-issue-detail';

export function setPartialIssueData(
  projectIssue: ProjectIssue,
  partialIssueData: any
): void {
  const keys = Object.keys(partialIssueData);

  const [detailFields, issueFields] = _.partition(keys, key => {
    return key === 'content';
  });

  if (detailFields.length && !projectIssue.detail) {
    projectIssue.detail = new ProjectIssueDetail();
  }

  detailFields.forEach((key: string) => {
    projectIssue.detail[key] = partialIssueData[key];
  });

  issueFields.forEach((key: string) => {
    projectIssue[key] = partialIssueData[key];
  });
}
