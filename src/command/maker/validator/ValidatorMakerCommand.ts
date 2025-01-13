import { command } from '@/command/decorators.ts';
import type { CommandParamType, ICommand } from '@/command/types.ts';
import { AbstractValidator } from '@/validation/AbstractValidator.ts';
import { IsNotEmpty, IsString } from 'class-validator';
import { createValidator } from './createValidator.ts';

class Validator extends AbstractValidator {
  @IsString()
  @IsNotEmpty()
  value: string;
}

@command()
export class ValidatorMakerCommand implements ICommand {
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
    const validator = await prompt.input('Enter the validator name', {
      placeholder: 'e.g. module/validator',
      validator: (value) => {
        const result = new Validator().validateSync({ value });
        if (!result.success) {
          return result.details[0]?.constraints?.[0]?.message;
        }

        if (value.split('/').length !== 2) {
          return 'Validator name must be in the format of module/validator';
        }

        let [moduleFolder, configName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(configName);
        configName = toPascalCase(configName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${configName}Config.ts`;
        if (file.exists(fileName)) return `${configName}Config already exists`;
      },
    });

    if (isCanceled(validator)) {
      log.error(color.red('Validator creation canceled'));
      return;
    }

    const [module, name] = validator.split('/');

    const { validatorName, moduleName, moduleFolder } = await createValidator({
      name,
      moduleName: module,
      srcDir: directory.src,
      validationDir: directory.validation,
    });

    log.success(color.green(`${validatorName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${moduleFolder}/${directory.validation}/${validatorName}.ts was created
${icon.success} ${directory.validation}/${validatorName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
