import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createEntity } from './createEntity';

@command()
export class EntityMakerCommand implements ICommand {
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
    const config = await prompt.input('Enter the entity name', {
      placeholder: 'e.g. module/entity',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Entity name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Entity name must be in the format of module/entity';
        }

        let [moduleFolder, entityName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(entityName);
        entityName = toPascalCase(entityName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${entityName}Entity.ts`;
        if (file.exists(fileName)) return `${entityName}Entity already exists`;
      },
    });

    if (isCanceled(config)) {
      log.error(color.red('Entity creation canceled'));
      return;
    }

    const [module, name] = config.split('/');

    const { entityName, moduleName, moduleFolder } = await createEntity({
      name,
      moduleName: module,
      srcDir: directory.src,
      entityDir: directory.entity,
      repositoryDir: directory.repository,
      databaseDir: directory.database,
    });

    log.success(color.green(`${entityName} created`));
    log.message(
      color.reset(
        color.dim(
          `${icon.success} ${moduleFolder}/${directory.entity}/${entityName}.ts was created
${icon.success} ${directory.entity}/${entityName}.ts was imported to ${moduleFolder}/${moduleName}.ts`,
        ),
      ),
    );
  }
}
