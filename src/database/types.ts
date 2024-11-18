import { DataSource } from 'npm:typeorm';

export interface IDatabase {
    getDataSource(): DataSource;
}
