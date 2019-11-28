import * as _ from 'lodash';

import { ProjectRepository } from '../project-repository';

const idNumberLenght = 4;

export class ProjectIdFactory {
  public async generateId(): Promise<string> {
    const allProjectCount = await ProjectRepository.getAllProjectCount();
    return this.generateIdByPrefix('OPS', allProjectCount);
  }

  private generateIdByPrefix(prefix: string, baseNumber: number): string {
    if (baseNumber > Math.pow(10, idNumberLenght) - 1) {
      return;
    }
    return (
      prefix +
      _.padStart(
        baseNumber.toString(),
        idNumberLenght - baseNumber.toString().length,
        '0'
      )
    );
  }
}
