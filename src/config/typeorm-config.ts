import { ConnectionOptions } from 'typeorm';

import { configure } from './configure';

export function getPostgresConfig(): ConnectionOptions {
  return {
    type: 'mysql',
    host: configure.getConfigByKey('MYSQL_HOST'),
    username: configure.getConfigByKey('MYSQL_USERNAME'),
    password: configure.getConfigByKey('MYSQL_PASSWORD'),
    database: configure.getConfigByKey('MYSQL_DB'),
    synchronize: true, // unsafe in production
    charset: 'utf8mb4',
    timezone: configure.getConfigByKey('TIMEZONE'),
    entities: ['src/orm/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/orm',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  };
}
