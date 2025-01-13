import { toKebabCase } from '@std/text/to-kebab-case';
import { toPascalCase } from '@std/text/to-pascal-case';
import { createModule } from '../module/createModule.ts';
import { createRepository } from '../repository/createRepository.ts';

export const createEntity = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  entityDir: string;
  repositoryDir: string;
}): Promise<{
  entityFolder: string;
  entityName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const entityFolder = toKebabCase(config.name);
  const entityName = `${toPascalCase(entityFolder)}Entity`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.entityDir}`;
  const importContent = `export { ${entityName} } from './${config.entityDir}/${entityName}.ts';`;
  const entityModuleFile = Bun.file(
    `${config.srcDir}/${moduleFolder}/${moduleName}.ts`,
  );

  if (await entityModuleFile.exists()) {
    const content = await entityModuleFile.text();
    if (!content.includes(importContent)) {
      await entityModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await entityModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.srcDir}/${moduleFolder}/${config.entityDir}/${entityName}.ts`;
  const content = `import { Random } from '@ooneex/eagle/random';
import { BaseEntity } from '@/shared/SharedModule.ts';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ${entityName} extends BaseEntity {
  @PrimaryColumn('varchar', { length: 15 })
  id: string = Random.nanoid(15);

  @Column()
  name: string;
}
`;

  await Bun.file(fileName).write(content);

  await createRepository({
    name: config.name,
    moduleName: config.moduleName,
    srcDir: config.srcDir,
    repositoryDir: config.repositoryDir,
  });

  return { entityFolder, entityName, moduleName, moduleFolder };
};
