import Sequelize from 'sequelize';
import config from '../service/config.js';

export const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: config.getDBPath()
});
