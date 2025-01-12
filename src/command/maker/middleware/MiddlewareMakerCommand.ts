import { command } from '@/command/decorators.ts';
import type { CommandParamType, ICommand } from '@/command/types.ts';
import { IsNotEmpty, IsString } from '@/validation';
import { AbstractValidator } from '@/validation/AbstractValidator.ts';
import { createMiddleware } from './createMiddleware.ts';

class MiddlewareValidator extends AbstractValidator {
  @IsString()
  @IsNotEmpty()
  value: string;
}

@command()
export class MiddlewareMakerCommand implements ICommand {
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
    const config = await prompt.input('Enter the middleware name', {
      placeholder: 'e.g. module/middleware',
      validator: (value) => {
        const result = new MiddlewareValidator().validateSync({ value });
        if (!result.success) {
          return result.details[0]?.constraints?.[0]?.message;
        }

        if (value.split('/').length !== 2) {
          return 'Middleware name must be in the format of module/middleware';
        }

        let [moduleFolder, configName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(configName);
        configName = toPascalCase(configName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${configName}Middleware.ts`;
        if (file.exists(fileName))
          return `${configName}Middleware already exists`;
      },
    });

    if (isCanceled(config)) {
      log.error(color.red('Config creation canceled'));
      return;
    }

    const [module, name] = config.split('/');

    const { middlewareName, moduleName, moduleFolder } = await createMiddleware(
      {
        name,
        moduleName: module,
        srcDir: directory.src,
        middlewareDir: directory.middleware,
      },
    );

    log.success(color.green(`${middlewareName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${moduleFolder}/${directory.middleware}/${middlewareName}.ts was created
${icon.success} ${moduleFolder}/${directory.middleware}/${middlewareName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
