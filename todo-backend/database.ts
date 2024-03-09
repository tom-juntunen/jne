// database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Path to the SQLite database file
});

export default sequelize;
