import { toKebabCase } from '@std/text/to-kebab-case';
import { toPascalCase } from '@std/text/to-pascal-case';
import { createDatabase } from '../database/createDatabase.ts';
import { createModule } from '../module/createModule.ts';

export const createRepository = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  repositoryDir: string;
  databaseDir: string;
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

  await createDatabase({
    name: 'default',
    moduleName: 'shared',
    srcDir: config.srcDir,
    databaseDir: config.databaseDir,
  });

  const repositoryFolder = toKebabCase(config.name);
  const repositoryName = `${toPascalCase(repositoryFolder)}Repository`;
  const entityName = `${toPascalCase(repositoryFolder)}Entity`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.repositoryDir}`;
  const importContent = `export { ${repositoryName} } from './${config.repositoryDir}/${repositoryName}.ts';`;
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
  const content = `import { repository } from '@ooneex/eagle';
import type { DefaultDatabase } from '@/shared/SharedModule.ts';
import { ${entityName} } from '@/${moduleFolder}/${moduleName}.ts';
import type { FindOptionsWhere } from 'typeorm';

@repository()
export class ${repositoryName} {
  constructor(private readonly database: DefaultDatabase) {}

  public async find(id: string): Promise<${entityName} | null> {
    const userRepository = await this.database.getRepository(${entityName});

    return userRepository.findOne({ where: { id: id } });
  }

  public async findAll(): Promise<${entityName}[]> {
    const userRepository = await this.database.getRepository(${entityName});

    return userRepository.find();
  }

  public async findOneBy(
    where: FindOptionsWhere<${entityName}>,
  ): Promise<${entityName} | null> {
    const userRepository = await this.database.getRepository(${entityName});

    return userRepository.findOneBy(where);
  }

  public async findBy(
    where: FindOptionsWhere<${entityName}>,
  ): Promise<${entityName}[]> {
    const userRepository = await this.database.getRepository(${entityName});

    return userRepository.find({ where });
  }

  public async create(user: ${entityName}): Promise<${entityName}> {
    const userRepository = await this.database.getRepository(${entityName});

    return userRepository.save(user);
  }

  public async update(user: ${entityName}): Promise<${entityName}> {
    const userRepository = await this.database.getRepository(${entityName});

    return userRepository.save(user);
  }

  public async delete(id: string): Promise<void> {
    const userRepository = await this.database.getRepository(${entityName});

    await userRepository.softDelete({ id });
  }

  public async deleteBy(where: FindOptionsWhere<${entityName}>): Promise<void> {
    const userRepository = await this.database.getRepository(${entityName});

    await userRepository.softDelete(where);
  }
}
`;

  await Bun.file(fileName).write(content);

  return { repositoryFolder, repositoryName, moduleName, moduleFolder };
};
