import { Database } from 'bun:sqlite';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Glob } from 'bun';

export type DatabaseConfigType = {
  url: string;
  location?: string;
  enableWAL?: boolean;
  readonly?: boolean;
  create?: boolean;
  readwrite?: boolean;
  safeIntegers?: boolean;
  strict?: boolean;
  migrations: {
    table: string;
    location: string;
  };
};

export abstract class AbstractDatabase {
  public abstract getConfig(database?: string): DatabaseConfigType;

  public getSource(database?: string): Database {
    const config = this.getConfig(database);
    if (config.location) {
      mkdirSync(config.location, { recursive: true });
    }

    const db = new Database(`${config.location}/${config.url}`, {
      readonly: config.readonly,
      create: config.create,
      readwrite: config.readwrite,
      safeIntegers: config.safeIntegers,
      strict: config.strict,
    });

    return db;
  }

  private createMigrationsTable(db: Database, tableName: string): void {
    db.query(
      `CREATE TABLE IF NOT EXISTS ${tableName} (id TEXT PRIMARY KEY);`,
    ).run();
  }

  private hasMigration(db: Database, tableName: string, id: string): boolean {
    return !!db.query(`SELECT id FROM ${tableName} WHERE id = '${id}';`).get();
  }

  private getMigrations(): { id: string; file: string }[] {
    const config = this.getConfig();
    mkdirSync(config.migrations.location, { recursive: true });

    const glob = new Glob('*.sql');
    return Array.from(glob.scanSync(config.migrations.location))
      .sort()
      .map((file) => ({
        id: file.match(/(\d+)\.sql$/)?.[1] as string,
        file: `${config.migrations.location}/${file}`,
      }));
  }

  public runMigration(database?: string): string[] {
    const config = this.getConfig(database);
    if (config.location) {
      mkdirSync(config.migrations.location, { recursive: true });
    }
    const db = this.getSource(database);
    if (config.enableWAL) {
      db.exec('PRAGMA journal_mode = WAL;');
    }

    this.createMigrationsTable(db, config.migrations.table);
    const migrations = this.getMigrations();

    const results: string[] = [];

    db.transaction(() => {
      for (const migration of migrations) {
        const id = migration.id;

        if (this.hasMigration(db, config.migrations.table, id as string)) {
          continue;
        }

        const sql = readFileSync(migration.file, {
          encoding: 'utf8',
          flag: 'r',
        });

        db.query(sql).run();
        db.query(
          `INSERT INTO ${config.migrations.table} (id) VALUES ('${id}');`,
        ).run();

        results.push(migration.file);
      }
    })();

    db.close(false);

    return results;
  }

  public getNextMigrationFileName(): string {
    const existingMigrations = this.getMigrations()
      .map((file) => {
        const match = file.id.match(/^(\d+)$/);
        return match ? Number.parseInt(match[1], 10) : null;
      })
      .filter(Boolean) as number[];

    const nextMigrationNumber =
      existingMigrations.length > 0 ? Math.max(...existingMigrations) + 1 : 1;

    return `${nextMigrationNumber.toString().padStart(7, '0')}.sql`;
  }

  public generateMigration(): string {
    const config = this.getConfig();
    const nextMigrationFileName = this.getNextMigrationFileName();
    const file = `${config.migrations.location}/${nextMigrationFileName}`;

    writeFileSync(file, '');

    return file;
  }
}
