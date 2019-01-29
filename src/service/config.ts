import * as yaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs';

class Configure {
  constructor() {
    const configDoc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../config.yaml'), 'utf8'));
    Object.assign(this, configDoc);
  }

  public getDBPath() {
    return `../../db/db.sqlite`;
  }
}

export default new Configure();
