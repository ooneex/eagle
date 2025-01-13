import { command } from '@/command/decorators.ts';
import type { CommandParamType, ICommand } from '@/command/types.ts';
import { cv } from '@/validation';
import { AbstractValidator } from '@/validation/AbstractValidator.ts';
import { createDatabase } from './createDatabase.ts';

class DatabaseValidator extends AbstractValidator {
  @cv.IsString()
  @cv.IsNotEmpty()
  value: string;
}

@command()
export class DatabaseMakerCommand implements ICommand {
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
    const database = await prompt.input('Enter the database name', {
      placeholder: 'e.g. module/database',
      validator: (value) => {
        const result = new DatabaseValidator().validateSync({ value });
        if (!result.success) {
          return result.details[0]?.constraints?.[0]?.message;
        }

        if (value.split('/').length !== 2) {
          return 'Database name must be in the format of module/database';
        }

        let [moduleFolder, databaseName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        databaseName = toPascalCase(databaseName);
        const fileName = `${directory.src}/${moduleFolder}/${databaseName}Database.ts`;
        if (file.exists(fileName))
          return `${databaseName}Database already exists`;
      },
    });

    if (isCanceled(database)) {
      log.error(color.red('Database creation canceled'));
      return;
    }

    const [module, name] = database.split('/');

    const { databaseName, moduleName, moduleFolder } = await createDatabase({
      name,
      moduleName: module,
      srcDir: directory.src,
      databaseDir: directory.database,
    });

    log.success(color.green(`${databaseName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${moduleFolder}/${directory.database}/${databaseName}.ts was created
${icon.success} ${directory.database}/${databaseName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
