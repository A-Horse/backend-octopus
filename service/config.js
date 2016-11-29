export const ENVIR_PRODUCT = 'ENVIR_PRODUCT';
export const ENVIR_TEST = 'ENVIR_TEST';
export const ENVIR_DEV = 'ENVIR_DEV';

class Configure {
  constructor() {
    this.argv = require('optimist').argv;
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
}

export default new Configure();
