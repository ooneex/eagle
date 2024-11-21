import { NodePgDatabase } from 'npm:drizzle-orm/node-postgres';
import { IDatabase, IRepository } from './types.ts';

export abstract class AbstractRepository implements IRepository {
  public readonly database: NodePgDatabase;

  constructor(source: IDatabase) {
    this.database = source.getDataSource();
  }
}
