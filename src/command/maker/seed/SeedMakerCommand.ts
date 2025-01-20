import { isEmpty } from 'class-validator';
import { command } from '../../decorators';
import type { CommandParamType, ICommand } from '../../types';
import { createSeed } from './createSeed';

@command()
export class SeedMakerCommand implements ICommand {
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
    const seed = await prompt.input('Enter the seed name', {
      placeholder: 'e.g. module/seed',
      validator: (value) => {
        if (isEmpty(value)) {
          return 'Seed name is required';
        }

        if (value.split('/').length !== 2) {
          return 'Seed name must be in the format of module/seed';
        }

        let [seedFolder, seedName] = value.split('/');

        seedFolder = toKebabCase(seedFolder);
        seedName = toPascalCase(seedName);
        const fileName = `${directory.cwd}/${directory.seeds}/${seedFolder}/${seedName}Seed.ts`;
        if (file.exists(fileName)) return `${seedName}Seed already exists`;
      },
    });

    if (isCanceled(seed)) {
      log.error(color.red('Seed creation canceled'));
      return;
    }

    const [folder, name] = seed.split('/');

    const { seedName, seedFolder } = await createSeed({
      name,
      folder,
      cwd: directory.cwd,
      seedDir: directory.seeds,
    });

    log.success(color.green(`${seedName} created`));
    log.message(
      color.reset(
        color.dim(
          `${icon.success} ${directory.seeds}/${seedFolder}/${seedName}.ts was created
${icon.success} ${seedFolder}/${seedName}.ts was imported to ${directory.seeds}/root.ts`,
        ),
      ),
    );
  }
}
