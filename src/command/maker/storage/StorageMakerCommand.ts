import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createStorage } from './createStorage';

@command()
export class StorageMakerCommand implements ICommand {
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
    const storage = await prompt.input('Enter the storage name', {
      placeholder: 'e.g. module/storage',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Storage name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Storage name must be in the format of module/storage';
        }

        let [moduleFolder, storageName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(storageName);
        storageName = toPascalCase(storageName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${storageName}Storage.ts`;
        if (file.exists(fileName))
          return `${storageName}Storage already exists`;
      },
    });

    if (isCanceled(storage)) {
      log.error(color.red('Storage creation canceled'));
      return;
    }

    const [module, name] = storage.split('/');

    const { storageName, moduleName, moduleFolder } = await createStorage({
      name,
      moduleName: module,
      srcDir: directory.src,
      storageDir: directory.storage,
    });

    log.success(color.green(`${storageName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${moduleFolder}/${directory.storage}/${storageName}.ts was created
${icon.success} ${directory.storage}/${storageName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
