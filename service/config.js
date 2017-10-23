import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

export const ENVIR_PRODUCT = 'PRODUCT';
export const ENVIR_TEST = 'TEST';
export const ENVIR_DEV = 'DEV';

class Configure {
  constructor() {
    this.argv = require('optimist').argv;
    const configDoc = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8')
    );
    Object.assign(this, configDoc);
  }

  getEnvirType() {
    if (this.argv.product) {
      return ENVIR_PRODUCT;
    }
    if (this.argv.test) {
      return ENVIR_TEST;
    }
    return ENVIR_DEV;
  }

  // TODO move to db file
  getSpecDBPath() {
    return process.env.OCTOPUS_DB_PATH;
  }

  hasSpecDB() {
    return !!process.env.OCTOPUS_DB_PATH;
  }

  getDBPath() {
    if (this.hasSpecDB()) {
      return this.getSpecDBPath();
    }
    // TODO 用绝对路径
    // linux root not work
    return `./db/db-${this.getEnvirType()}.sqlite`;
  }
}

export default new Configure();
