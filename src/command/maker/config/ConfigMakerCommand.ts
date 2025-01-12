import { command } from '@/command/decorators.ts';
import type { CommandParamType, ICommand } from '@/command/types.ts';
import { IsNotEmpty, IsString } from '@/validation';
import { AbstractValidator } from '@/validation/AbstractValidator.ts';
import { createConfig } from './createConfig.ts';

class ConfigValidator extends AbstractValidator {
  @IsString()
  @IsNotEmpty()
  value: string;
}

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
        const result = new ConfigValidator().validateSync({ value });
        if (!result.success) {
          return result.details[0]?.constraints?.[0]?.message;
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
${icon.success} ${moduleFolder}/${directory.config}/${configName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
