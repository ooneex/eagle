import { NodePgDatabase } from 'npm:drizzle-orm/node-postgres';

export interface IDatabase {
  getDataSource(): NodePgDatabase;
}

export interface IRepository {
  readonly database: NodePgDatabase;
}
