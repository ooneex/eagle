import { toKebabCase } from '@std/text/to-kebab-case';
import { toPascalCase } from '@std/text/to-pascal-case';

export const createCommand = async (config: {
  name: string;
  moduleName: string;
  cwd: string;
  commandDir: string;
}): Promise<{
  commandFolder: string;
  commandName: string;
}> => {
  const commandFolder = toKebabCase(config.name);
  const commandName = `${toPascalCase(config.moduleName)}${toPascalCase(commandFolder)}Command`;

  await Bun.$`mkdir -p ${config.cwd}/${config.commandDir}/${commandFolder}`;
  const importContent = `export { ${commandName} } from './${commandFolder}/${commandName}.ts';`;
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
  const content = `import { type ScalarType, type ICommand, type CommandParamType, command } from '@ooneex/eagle';

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
