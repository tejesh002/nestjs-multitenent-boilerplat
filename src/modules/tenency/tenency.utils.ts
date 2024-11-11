import { TenentDataSource } from 'src/orm_configs/tenent_datasource';
import { DataSource } from 'typeorm';

const tenentConnections = new Map<string, DataSource>();

export async function getTenantConnection(schema: string) {
  const connection = await TenentDataSource(schema);
  if (tenentConnections.has(schema)) {
    const newconn = tenentConnections.get(schema);

    if (!newconn.isInitialized) {
      tenentConnections.set(schema, connection);
      return connection.initialize();
    }
    return newconn;
  }
  tenentConnections.set(schema, connection);
  return connection.initialize();
}
