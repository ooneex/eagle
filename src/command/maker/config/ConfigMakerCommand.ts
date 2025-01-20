import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createConfig } from './createConfig';

@command()
export class ConfigMakerCommand implements ICommand {
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
    const config = await prompt.input('Enter the config name', {
      placeholder: 'e.g. module/config',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Config name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Config name must be in the format of module/config';
        }

        let [moduleFolder, configName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(configName);
        configName = toPascalCase(configName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${configName}Config.ts`;
        if (file.exists(fileName)) return `${configName}Config already exists`;
      },
    });

    if (isCanceled(config)) {
      log.error(color.red('Config creation canceled'));
      return;
    }

    const [module, name] = config.split('/');

    const { configName, moduleName, moduleFolder } = await createConfig({
      name,
      moduleName: module,
      srcDir: directory.src,
      configDir: directory.config,
    });

    log.success(color.green(`${configName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${moduleFolder}/${directory.config}/${configName}.ts was created
${icon.success} ${directory.config}/${configName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
