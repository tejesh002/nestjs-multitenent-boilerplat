import { config } from 'dotenv';
import { join } from 'path';
import { SnakeNamingStrategy } from 'src/utils/snake-naming.strategy';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const DataSourceConnection: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [join(__dirname, '../modules/admin/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migration/admin/*{.ts,.js}')],
};

export const AppDataSource = new DataSource(DataSourceConnection);
