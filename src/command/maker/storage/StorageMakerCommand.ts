import { command } from '@/command/decorators.ts';
import type { CommandParamType, ICommand } from '@/command/types.ts';
import { cv } from '@/validation';
import { AbstractValidator } from '@/validation/AbstractValidator.ts';
import { createStorage } from './createStorage.ts';

class StorageValidator extends AbstractValidator {
  @cv.IsString()
  @cv.IsNotEmpty()
  value: string;
}

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
        const result = new StorageValidator().validateSync({ value });
        if (!result.success) {
          return result.details[0]?.constraints?.[0]?.message;
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
