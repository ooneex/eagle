import { toKebabCase, toPascalCase } from '../../../helper';
import { createModule } from '../module/createModule';

export const createStorage = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  storageDir: string;
}): Promise<{
  storageFolder: string;
  storageName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const storageFolder = toKebabCase(config.name);
  const storageName = `${toPascalCase(config.moduleName)}${toPascalCase(storageFolder)}Storage`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.storageDir}`;
  const importContent = `export { ${storageName} } from './${config.storageDir}/${storageName}.ts';`;
  const storageModuleFile = Bun.file(
    `${config.srcDir}/${moduleFolder}/${moduleName}.ts`,
  );

  if (await storageModuleFile.exists()) {
    const content = await storageModuleFile.text();
    if (!content.includes(importContent)) {
      await storageModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await storageModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.srcDir}/${moduleFolder}/${config.storageDir}/${storageName}.ts`;
  const content = `import { AbstractStorage, storage } from '@ooneex/eagle';
import type { S3Options } from 'bun';

@storage()
export class ${storageName} extends AbstractStorage {
  public getOptions(): S3Options {
    return {
      accessKeyId: 's3-key',
      secretAccessKey: 's3-secret',
      bucket: 's3-bucket',
      region: 's3-region',
    };
  }
}
`;

  await Bun.file(fileName).write(content);

  return { storageFolder, storageName, moduleName, moduleFolder };
};
