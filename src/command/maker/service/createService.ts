import { toKebabCase } from '@/helper/toKebabCase.ts';
import { toPascalCase } from '@/helper/toPascalCase.ts';
import { createModule } from '../module/createModule.ts';

export const createService = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  serviceDir: string;
}): Promise<{
  serviceFolder: string;
  serviceName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const serviceFolder = toKebabCase(config.name);
  const serviceName = `${toPascalCase(config.moduleName)}${toPascalCase(serviceFolder)}Service`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.serviceDir}`;
  const importContent = `import './${config.serviceDir}/${serviceName}.ts';`;
  const serviceModuleFile = Bun.file(
    `${config.srcDir}/${moduleFolder}/${moduleName}.ts`,
  );

  if (await serviceModuleFile.exists()) {
    const content = await serviceModuleFile.text();
    if (!content.includes(importContent)) {
      await serviceModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await serviceModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.srcDir}/${moduleFolder}/${config.serviceDir}/${serviceName}.ts`;
  const content = `import { type IService, service } from '@ooneex/eagle';

@service()
export class ${serviceName} implements IService {
  // code goes here
}
`;

  await Bun.file(fileName).write(content);

  return { serviceFolder, serviceName, moduleName, moduleFolder };
};
