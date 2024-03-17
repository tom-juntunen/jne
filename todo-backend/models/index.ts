'use strict';

import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import * as allConfig from '../config/config.json';

type Environment = 'development' | 'test' | 'production';
type Dialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';

interface ConfigEnvironment {
  storage?: string;
  dialect: Dialect;
  logging: boolean;
  use_env_variable?: string;
  database?: string;
  username?: string;
  password?: string;
  pool?: {
      max?: number;
      min?: number;
      acquire?: number;
      idle?: number;
  };
  define?: {};
  // Add other Sequelize configuration options as needed
}

type ConfigAttributes = {
  [K in Environment]?: ConfigEnvironment;
};

const config: ConfigAttributes = allConfig as ConfigAttributes;

const basename = path.basename(__filename);
const env: Environment = (process.env.NODE_ENV as Environment) || 'development';
const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`Configuration for environment ${env} is not defined.`);
}

const db: { [key: string]: any; sequelize?: Sequelize } = {};

let sequelize: Sequelize;
if (dbConfig.use_env_variable) {
    const connectionString = process.env[dbConfig.use_env_variable];
    if (!connectionString) {
        throw new Error(`Environment variable ${dbConfig.use_env_variable} not set.`);
    }
    sequelize = new Sequelize(connectionString, {
        dialect: dbConfig.dialect,
        storage: dbConfig.storage,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
        define: dbConfig.define,
    });
} else if (dbConfig.database) {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username || '', dbConfig.password || '', {
        dialect: dbConfig.dialect,
        storage: dbConfig.storage,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
        define: dbConfig.define,
    });
} else {
    throw new Error('Database configuration is not properly set.');
}

fs.readdirSync(__dirname)
.filter((file) => {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts' && !file.endsWith('.test.ts');
})
.forEach((file) => {
  import(path.join(__dirname, file)).then((model) => {
    if ('default' in model) {
      const modelInstance = model.default(sequelize, DataTypes);
      if (modelInstance && modelInstance.name) {
        db[modelInstance.name] = modelInstance;

        if (typeof modelInstance.associate === 'function') {
          modelInstance.associate(db);
        }
      }
    }
  });
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;