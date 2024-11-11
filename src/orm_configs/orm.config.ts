import { readFileSync } from 'fs';
import { join } from 'path';
import { env } from 'src/config';
import { SnakeNamingStrategy } from 'src/utils/snake-naming.strategy';

module.exports = {
  type: 'postgres', // RDBMS
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
  ssl:
    env.node_env != 'production'
      ? false
      : {
          rejectUnauthorized: true,
          ca: readFileSync(process.env.DB_CERTIFICATE).toString(),
        },
  autoLoadEntities: true,
  entities: [join(__dirname, './modules/admin/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, './migrations/admin/*{.ts,.js}')],
};
