import * as yaml from 'js-yaml';
import * as path from 'path';
import * as fs from 'fs';
import * as R from 'ramda';

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

    this.overrideConfigKeyFromEnv();
  }

  public getConfig() {
    return this.configDoc;
  }

  public getConfigByKey(key: string) {
    return this.configDoc[key];
  }

  private overrideConfigKeyFromEnv() {
    this.configDoc = R.mapObjIndexed((value: string, key: string, config: any) => {
      if (process.env[key]) {
        config[key] = process.env[key];
      }
      return config[key];
    }, this.configDoc);
  }
 
}

export const configure = new Configure();
