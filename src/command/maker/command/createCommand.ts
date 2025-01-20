import { toKebabCase, toPascalCase } from '../../../helper';

export const createCommand = async (config: {
  name: string;
  folderName: string;
  cwd: string;
  commandDir: string;
}): Promise<{
  commandFolder: string;
  commandName: string;
}> => {
  const commandFolder = toKebabCase(config.folderName);
  const commandName = `${toPascalCase(config.folderName)}${toPascalCase(config.name)}Command`;

  await Bun.$`mkdir -p ${config.cwd}/${config.commandDir}/${commandFolder}`;
  const importContent = `import './${commandFolder}/${commandName}';`;
  const commandModuleFile = Bun.file(
    `${config.cwd}/${config.commandDir}/RootCommand.ts`,
  );

  if (await commandModuleFile.exists()) {
    const content = await commandModuleFile.text();
    if (!content.includes(importContent)) {
      await commandModuleFile.write(`${content}${importContent}\n`);
    }
  } else {
    await commandModuleFile.write(`${importContent}\n`);
  }

  const fileName = `${config.cwd}/${config.commandDir}/${commandFolder}/${commandName}.ts`;
  const content = `import { type CommandParamType, type ICommand, command } from '@ooneex/eagle';

@command('${commandName} description')
export class ${commandName} implements ICommand {
  public async execute(context: CommandParamType): Promise<void> {
    console.info(context);
  }
}
`;

  await Bun.file(fileName).write(content);

  return { commandFolder, commandName };
};
