import { toKebabCase, toPascalCase } from '../../../helper';

export const createModule = async (config: {
  name: string;
  srcDir: string;
}): Promise<{
  moduleFolder: string;
  moduleName: string;
}> => {
  const moduleFolder = toKebabCase(config.name);
  const moduleName = `${toPascalCase(moduleFolder)}Module`;

  await Bun.$`mkdir -p ${config.srcDir}/${moduleFolder}`;

  const importContent = `import './${moduleFolder}/${moduleName}.ts';`;
  const rootModuleFile = Bun.file(`${config.srcDir}/RootModule.ts`);

  if (await rootModuleFile.exists()) {
    const content = await rootModuleFile.text();
    if (!content.includes(importContent)) {
      await rootModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await rootModuleFile.write(`${importContent}\n`);
  }

  return { moduleFolder, moduleName };
};
