import { toKebabCase } from '@/helper/toKebabCase.ts';
import { toPascalCase } from '@/helper/toPascalCase.ts';

export const createModule = async (config: {
  name: string;
  srcDir: string;
}): Promise<{
  folderName: string;
  moduleName: string;
}> => {
  const folderName = toKebabCase(config.name);
  const moduleName = `${toPascalCase(folderName)}Module`;
  const fileName = `${config.srcDir}/${folderName}/${moduleName}.ts`;

  await Bun.$`mkdir -p ${config.srcDir}/${folderName}`;
  await Bun.file(fileName).write('');

  const importContent = `import './${folderName}/${moduleName}.ts';`;
  const rootModuleFile = Bun.file(`${config.srcDir}/RootModule.ts`);

  if (await rootModuleFile.exists()) {
    const content = await rootModuleFile.text();
    if (!content.includes(importContent)) {
      await rootModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await rootModuleFile.write(`${importContent}\n`);
  }

  return { folderName, moduleName };
};
