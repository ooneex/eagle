import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createModule } from './createModule';

@command()
export class ModuleMakerCommand implements ICommand {
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
    const module = await prompt.input('Enter the module name', {
      placeholder: 'user, product, etc.',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Module name is required';
        }

        const folderName = toKebabCase(value);
        const moduleName = toPascalCase(folderName);
        const fileName = `${directory.src}/${folderName}/${moduleName}Module.ts`;
        if (file.exists(fileName)) return `${moduleName}Module already exists`;
      },
    });

    if (isCanceled(module)) {
      log.error(color.red('Module creation canceled'));
      return;
    }

    const { moduleFolder: folderName, moduleName } = await createModule({
      name: module,
      srcDir: directory.src,
    });

    log.success(color.green(`${moduleName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${folderName}/${moduleName}.ts was created
${icon.success} ${folderName}/${moduleName}.ts was imported to RootModule.ts`),
      ),
    );
  }
}
