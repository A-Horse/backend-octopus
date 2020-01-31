import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as R from 'ramda';

interface Config {
  SERVE_PORT: number;
  TOOL_SERVE_PORT: number;
  DISABLE_SIGNUP: boolean | null;
  JWT_EXP_HOURS: number;
  SECRET_KEY: string;
  MYSQL_HOST: string;
  MYSQL_USERNAME: string;
  MYSQL_PASSWORD: string;
  MYSQL_DB: string;
  MONGO_URL: string;
  MONGO_DB: string;
  TIMEZONE: string;
  SWAGGER: boolean;
  MinIOEndPoint: string;
  MinIOAccessKey: string;
  MinIOSecretKey: string;
  MinIOImageBucketName: string;
}

type ConfigKey =
  | 'SERVE_PORT'
  | 'TOOL_SERVE_PORT'
  | 'DISABLE_SIGNUP'
  | 'JWT_EXP_HOURS'
  | 'SERVE_PORT'
  | 'SECRET_KEY'
  | 'MYSQL_HOST'
  | 'MYSQL_USERNAME'
  | 'MYSQL_PASSWORD'
  | 'MYSQL_DB'
  | 'MONGO_URL'
  | 'MONGO_DB'
  | 'TIMEZONE'
  | 'SWAGGER'
  | 'MinIOEndPoint'
  | 'MinIOAccessKey'
  | 'MinIOSecretKey';

class Configure {
  private configMap: Config; // TODO: remove

  constructor() {}

  public getConfig(): Config {
    return this.configMap;
  }

  // TODO: Deprecated
  public get(key: ConfigKey): ReturnType<() => Config[ConfigKey]> {
    return this.configMap[key];
  }

  // TODO: Deprecated
  public set(key: ConfigKey, value: string): void {
    this.configMap[key as string] = value;
  }

  private overrideConfigKeyFromCustomConfig(specConfigFileName: string) {
    const customConfigMap = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, `../../config/${specConfigFileName}`), 'utf8')
    );
    if (!customConfigMap) {
      return;
    }
    this.configMap = R.mapObjIndexed((value: string, key: string, config: Config) => {
      if (customConfigMap[key]) {
        config[key] = customConfigMap[key];
      }
      return config[key];
    }, this.configMap);
  }

  public loadConfigureFromFile(specConfigFileName = 'custom.config.yaml') {
    this.configMap = yaml.safeLoad(
      fs.readFileSync(path.join(__dirname, '../../config/config.yaml'), 'utf8')
    );
    this.overrideConfigKeyFromCustomConfig(specConfigFileName);
    this.overrideConfigKeyFromEnv();
  }

  private overrideConfigKeyFromEnv() {
    this.configMap = R.mapObjIndexed((value: string, key: string, config: any) => {
      if (process.env['OCTO_' + key]) {
        config[key] = process.env['OCTO_' + key];
      }
      return config[key];
    }, this.configMap);
  }
}

export const configure = new Configure();
