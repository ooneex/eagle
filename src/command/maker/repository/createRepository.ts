import { toKebabCase, toPascalCase } from '../../../helper';
import { createModule } from '../module/createModule';

export const createRepository = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  repositoryDir: string;
  databaseDir: string;
  entityDir: string;
}): Promise<{
  repositoryFolder: string;
  repositoryName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const repositoryFolder = toKebabCase(config.name);
  const repositoryName = `${toPascalCase(repositoryFolder)}Repository`;
  const entityName = `${toPascalCase(repositoryFolder)}Entity`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.repositoryDir}`;
  const importContent = `import './${config.repositoryDir}/${repositoryName}';`;
  const repositoryModuleFile = Bun.file(
    `${config.srcDir}/${moduleFolder}/${moduleName}.ts`,
  );

  if (await repositoryModuleFile.exists()) {
    const content = await repositoryModuleFile.text();
    if (!content.includes(importContent)) {
      await repositoryModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await repositoryModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.srcDir}/${moduleFolder}/${config.repositoryDir}/${repositoryName}.ts`;
  const content = `import { repository, inject } from '@ooneex/eagle';
import { DefaultDatabase } from '@/shared/${config.databaseDir}/DefaultDatabase';
import { ${entityName} } from '@/${moduleFolder}/${config.entityDir}/${entityName}';
import type { Repository } from 'typeorm';

@repository()
export class ${repositoryName} {
  constructor(
    @inject(DefaultDatabase)
    private readonly database: DefaultDatabase,
  ) {}

  public async open(): Promise<Repository<${entityName}>> {
    return await this.database.open(${entityName});
  }

  public async close(): Promise<void> {
    await this.database.close();
  }
}
`;

  await Bun.file(fileName).write(content);

  return { repositoryFolder, repositoryName, moduleName, moduleFolder };
};
