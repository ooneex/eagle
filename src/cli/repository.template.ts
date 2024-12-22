export const repositoryTemplate = (
  moduleName: string,
  repositoryName: string,
) => {
  return `import { MainDatabase } from '@/shared/databases/MainDatabase.ts';
import { ${repositoryName}, ${repositoryName}MutationType, ${repositoryName}Type } from '@/${moduleName}/schemas/${repositoryName}Schema.ts';
import { and, eq, isNull } from 'drizzle-orm';
import { repository } from '@ooneex/eagle/database';

@repository()
export class ${repositoryName}Repository {
  private readonly source;

  constructor(database: MainDatabase) {
    this.source = database.getDataSource();
  }

  public async list(): Promise<${repositoryName}Type[]> {
    return await this.source.query.${repositoryName}.findMany({
      where: isNull(${repositoryName}.deletedAt),
    });
  }

  public async create(data: ${repositoryName}MutationType): Promise<${repositoryName}Type> {
    return (await this.source.insert(${repositoryName}).values(data).returning())[0];
  }

  public async find(id: string): Promise<${repositoryName}Type | null> {
    return (await this.source.query.${repositoryName}.findFirst({
      where: and(eq(${repositoryName}.id, id), isNull(${repositoryName}.deletedAt)),
    })) ?? null;
  }

  public async update(id: string, data: ${repositoryName}MutationType): Promise<${repositoryName}Type> {
    return (await this.source.update(${repositoryName}).set(data).where(eq(${repositoryName}.id, id))
      .returning())[0];
  }

  public async delete(id: string) {
    return await this.source
      .update(${repositoryName})
      .set({ deletedAt: new Date() })
      .where(eq(${repositoryName}.id, id));
  }

  public async restore(id: string): Promise<${repositoryName}Type> {
    return (await this.source
      .update(${repositoryName})
      .set({ deletedAt: null })
      .where(eq(${repositoryName}.id, id))
      .returning())[0];
  }

  public async hardDelete(id: string): Promise<${repositoryName}Type> {
    return (await this.source.delete(${repositoryName}).where(eq(${repositoryName}.id, id)).returning())[0];
  }

  public async count(): Promise<number> {
    return await this.source.$count(${repositoryName}, isNull(${repositoryName}.deletedAt));
  }

  public async lock(id: string): Promise<${repositoryName}Type> {
    return (await this.source
      .update(${repositoryName})
      .set({ lockedAt: new Date() })
      .where(eq(${repositoryName}.id, id))
      .returning())[0];
  }

  public async unlock(id: string): Promise<${repositoryName}Type> {
    return (await this.source
      .update(${repositoryName})
      .set({ lockedAt: null })
      .where(eq(${repositoryName}.id, id))
      .returning())[0];
  }

  public async block(id: string): Promise<${repositoryName}Type> {
    return (await this.source
      .update(${repositoryName})
      .set({ blockedAt: new Date() })
      .where(eq(${repositoryName}.id, id))
      .returning())[0];
  }

  public async unblock(id: string): Promise<${repositoryName}Type> {
    return (await this.source
      .update(${repositoryName})
      .set({ blockedAt: null })
      .where(eq(${repositoryName}.id, id))
      .returning())[0];
  }

  public async activate(id: string): Promise<${repositoryName}Type> {
    return (await this.source
      .update(${repositoryName})
      .set({ activeAt: new Date() })
      .where(eq(${repositoryName}.id, id))
      .returning())[0];
  }

  public async deactivate(id: string): Promise<${repositoryName}Type> {
    return (await this.source
      .update(${repositoryName})
      .set({ activeAt: null })
      .where(eq(${repositoryName}.id, id))
      .returning())[0];
  }
}
`;
};
