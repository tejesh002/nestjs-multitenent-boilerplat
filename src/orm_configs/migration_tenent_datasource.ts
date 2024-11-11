import { config } from 'dotenv';
import { join } from 'path';
import { SnakeNamingStrategy } from 'src/utils/snake-naming.strategy';
import { DataSource } from 'typeorm';
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  logging: true,
  entities: [join(__dirname, '../modules/tenented/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../migration/tenented/*{.ts,.js}')],
});
