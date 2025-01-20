import pluralize from 'pluralize';
import { toKebabCase, toPascalCase } from '../../../helper';
import { createModule } from '../module/createModule';

export const createDatabase = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  databaseDir: string;
}): Promise<{
  databaseFolder: string;
  databaseName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const databaseFolder = toKebabCase(config.name);
  const databaseName = `${toPascalCase(databaseFolder)}Database`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.databaseDir}`;
  const importContent = `export { ${databaseName} } from './${config.databaseDir}/${databaseName}.ts';`;
  const configModuleFile = Bun.file(
    `${config.srcDir}/${moduleFolder}/${moduleName}.ts`,
  );

  if (await configModuleFile.exists()) {
    const content = await configModuleFile.text();
    if (!content.includes(importContent)) {
      await configModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await configModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.srcDir}/${moduleFolder}/${config.databaseDir}/${databaseName}.ts`;
  const content = `import { database } from '@ooneex/eagle';
import {
  DataSource,
  type EntityManager,
  type EntityTarget,
  type ObjectLiteral,
  type Repository,
} from 'typeorm';

@database()
export class ${databaseName} {
  private async getSource(database?: string): Promise<DataSource> {
    return await new DataSource({
      type: 'sqlite',
      database: database ?? 'var/databases/${pluralize(databaseFolder)}.db',
      enableWAL: true,
      synchronize: true,
      entities: [],
    }).initialize();
  }

  public async getEntityManager(database?: string): Promise<EntityManager> {
    return (await this.getSource(database)).manager;
  }

  public async getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    database?: string,
  ): Promise<Repository<Entity>> {
    return (await this.getSource(database)).getRepository(entity);
  }
}
`;

  await Bun.file(fileName).write(content);

  return { databaseFolder, databaseName, moduleName, moduleFolder };
};
