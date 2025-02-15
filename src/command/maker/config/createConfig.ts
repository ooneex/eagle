import { toKebabCase, toPascalCase } from '../../../helper';
import { createModule } from '../module/createModule';

export const createConfig = async (config: {
  name: string;
  moduleName: string;
  srcDir: string;
  configDir: string;
}): Promise<{
  configFolder: string;
  configName: string;
  moduleName: string;
  moduleFolder: string;
}> => {
  const { moduleFolder, moduleName } = await createModule({
    name: config.moduleName,
    srcDir: config.srcDir,
  });

  const configFolder = toKebabCase(config.name);
  const configName = `${toPascalCase(config.moduleName)}${toPascalCase(configFolder)}Config`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}/${config.configDir}`;
  const importContent = `import './${config.configDir}/${configName}';`;
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

  const fileName = `${config.srcDir}/${moduleFolder}/${config.configDir}/${configName}.ts`;
  const content = `import { type ScalarType, type IConfig, config } from '@ooneex/eagle';

@config()
export class ${configName} implements IConfig {
  public toJson(): Record<string, ScalarType | null> {
    // code goes here
    return {};
  }
}
`;

  await Bun.file(fileName).write(content);

  return { configFolder, configName, moduleName, moduleFolder };
};
