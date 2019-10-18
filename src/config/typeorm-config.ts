import { configure } from '../configure';
import { ConnectionOptions } from 'typeorm';

export function getPostgresConfig(): ConnectionOptions {

  return {
    type: 'mysql',
    host: configure.getConfigByKey('MYSQL_HOST'),
    username: configure.getConfigByKey('MYSQL_USERNAME'),
    password: configure.getConfigByKey('MYSQL_PASSWORD'),
    database: configure.getConfigByKey('MYSQL_DB'),
    synchronize: true,
    charset: 'utf8mb4',
    // logging: true,
    timezone: 'Asia/Shanghai',
    entities: ['src/entity/**/*.ts'],
    migrations: ['src/migration/**/*.ts'],
    subscribers: ['src/subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber'
    }
  };
}
