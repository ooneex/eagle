import { DataSource } from 'typeorm';

export interface IDatabase {
  getDataSource(): DataSource;
}
