import { configure } from '../configure';
import { ConnectionOptions } from 'typeorm';

export function getPostgresConfig(): ConnectionOptions {
  return {
    type: 'mysql',
    host: configure.getConfigByKey('POSTGRES_HOST'),
    username: configure.getConfigByKey('POSTGRES_USERNAME'),
    password: configure.getConfigByKey('POSTGRES_PASSWORD'),
    database: configure.getConfigByKey('POSTGRES_DB'),
    synchronize: true,
    charset: 'utf8mb4',
    logging: true,
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
