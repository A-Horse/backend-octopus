import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

export const ENVIR_PRODUCT = 'PRODUCT';
export const ENVIR_TEST = 'TEST';
export const ENVIR_DEV = 'DEV';

class Configure {
  constructor() {
    const configDoc = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, '../../config.yaml'), 'utf8')
    );
    Object.assign(this, configDoc);
  }

  getDBPath() {
    return `../../db.sqlite`;
  }
}

export default new Configure();
