import * as yaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs';

class Configure {
  private configDoc: {
    DISABLE_SIGNUP: boolean | null,
    SERVE_PORT: number,
    JWT_EXP_HOURS: number,
    SERCET_KEY: string
  };

  constructor() {
    const configDoc = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, '../config.yaml'), 'utf8')
    );
    this.configDoc = configDoc;
  }

  public getConfig() {
    return this.configDoc;
  }
}

export const configure = new Configure();
