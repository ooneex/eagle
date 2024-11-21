import { drizzle } from 'drizzle-orm/node-postgres';

export interface IDatabase {
  getDataSource(): typeof drizzle;
}

export interface IEntity {
  id: string | number;
}

export interface IRepository<T extends IEntity> {
  readonly entityManager: string;
  get: (id: string | number) => Promise<T | null>;
  getAll: () => Promise<T[]>;
  create: (entity: T) => Promise<T>;
  update: (entity: T) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
}
