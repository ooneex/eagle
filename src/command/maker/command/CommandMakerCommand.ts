import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createCommand } from './createCommand';

@command()
export class CommandMakerCommand implements ICommand {
  public async execute({
    prompt,
    log,
    isCanceled,
    color,
    toKebabCase,
    toPascalCase,
    directory,
    file,
    icon,
  }: CommandParamType): Promise<void> {
    const command = await prompt.input('Enter the command name', {
      placeholder: 'e.g. module/command',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Command name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Command name must be in the format of module/command';
        }

        let [moduleFolder, commandName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(commandName);
        commandName = toPascalCase(commandName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${commandName}Command.ts`;
        if (file.exists(fileName))
          return `${commandName}Command already exists`;
      },
    });

    if (isCanceled(command)) {
      log.error(color.red('Command creation canceled'));
      return;
    }

    const [module, name] = command.split('/');

    const { commandName, commandFolder } = await createCommand({
      name,
      folderName: module,
      cwd: directory.cwd,
      commandDir: directory.commands,
    });

    log.success(color.green(`${commandName} created`));
    log.message(
      color.reset(
        color.dim(
          `${icon.success} ${commandFolder}/${commandName}.ts was created
${icon.success} ${commandFolder}/${commandName}.ts was imported to ${commandFolder}/RootCommand.ts`,
        ),
      ),
    );
  }
}
