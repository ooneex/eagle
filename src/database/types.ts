import { EntitySchema } from '@typeorm';

export type DatabaseType =
  | 'mysql'
  | 'postgres'
  | 'cockroachdb'
  | 'sap'
  | 'spanner'
  | 'mariadb'
  | 'sqlite'
  | 'cordova'
  | 'react-native'
  | 'nativescript'
  | 'sqljs'
  | 'oracle'
  | 'mssql'
  | 'mongodb'
  | 'aurora-mysql'
  | 'aurora-postgres'
  | 'expo'
  | 'better-sqlite3'
  | 'capacitor';

export interface IDatabase {
  getType(): DatabaseType;
  getConnectionUrl(): string;
  getEntities(): EntitySchema[];
  getSubscribers(): string[];
  getMigrations(): string[];
  logging(): boolean;
}
