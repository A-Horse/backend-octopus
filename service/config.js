export const ENVIR_PRODUCT = 'PRODUCT';
export const ENVIR_TEST = 'TEST';
export const ENVIR_DEV = 'DEV';

class Configure {
  constructor() {
    this.argv = require('optimist').argv;
  }

  getServerPort() {
    return this.argv.port || 5500;
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
    return `./db/db-${this.getEnvirType()}.sqlite`;
  }
}

export default new Configure();
