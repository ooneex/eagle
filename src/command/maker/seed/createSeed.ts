import { toKebabCase } from '@/helper/toKebabCase.ts';
import { toPascalCase } from '@/helper/toPascalCase.ts';

export const createSeed = async (config: {
  name: string;
  folder: string;
  cwd: string;
  seedDir: string;
}): Promise<{
  seedFolder: string;
  seedName: string;
}> => {
  const seedFolder = toKebabCase(config.folder);
  const seedName = `${toPascalCase(config.folder)}${toPascalCase(config.name)}Seed`;

  await Bun.$`mkdir -p ${config.cwd}/${config.seedDir}/${seedFolder}`;
  const importContent = `import './${seedFolder}/${seedName}.ts';`;
  const rootModuleFile = Bun.file(`${config.cwd}/${config.seedDir}/root.ts`);

  if (await rootModuleFile.exists()) {
    const content = await rootModuleFile.text();
    if (!content.includes(importContent)) {
      await rootModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await rootModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.cwd}/${config.seedDir}/${seedFolder}/${seedName}.ts`;
  const content = `import { type ISeed, seed } from '@ooneex/eagle';

@seed({ order: 1 })
export class ${seedName} implements ISeed {
  public async execute<T = unknown>(previousData?: T): Promise<T> {
    // code goes here
    return previousData as T;
  }
}
`;

  await Bun.file(fileName).write(content);

  return { seedFolder, seedName };
};
