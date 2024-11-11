import { join } from 'path';
import { env } from 'src/config';
import { DataSource } from 'typeorm';

export const TenentDataSource = (schema: string) => {
  return new DataSource({
    type: 'postgres',
    host: env.db_host,
    port: env.db_port,
    username: env.db_username,
    password: env.db_password,
    database: env.db_name,
    logging: true,
    schema: schema,
    entities: [join(__dirname, '../modules/tenented/**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../migration/tenented/*{.ts,.js}')],
  });
};
