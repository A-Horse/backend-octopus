import { ConnectionOptions } from 'typeorm';

import { configure } from './configure';

export function getPostgresConfig(): any {
  return {
    type: 'mysql',
    host: configure.get('MYSQL_HOST') as string,
    username: configure.get('MYSQL_USERNAME') as string,
    password: configure.get('MYSQL_PASSWORD') as string,
    database: configure.get('MYSQL_DB') as string,
    synchronize: true, // unsafe in production
    charset: 'utf8mb4',
    timezone: configure.get('TIMEZONE') as string,
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
