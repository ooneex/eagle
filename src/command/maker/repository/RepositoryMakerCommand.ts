import { command } from '@/command/decorators.ts';
import type { CommandParamType, ICommand } from '@/command/types.ts';
import { cv } from '@/validation';
import { AbstractValidator } from '@/validation/AbstractValidator.ts';
import { createRepository } from './createRepository.ts';

class RepositoryValidator extends AbstractValidator {
  @cv.IsString()
  @cv.IsNotEmpty()
  value: string;
}

@command()
export class RepositoryMakerCommand implements ICommand {
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
    const repository = await prompt.input('Enter the repository name', {
      placeholder: 'e.g. module/repository',
      validator: (value) => {
        const result = new RepositoryValidator().validateSync({ value });
        if (!result.success) {
          return result.details[0]?.constraints?.[0]?.message;
        }

        if (value.split('/').length !== 2) {
          return 'Repository name must be in the format of module/repository';
        }

        let [moduleFolder, repositoryName] = value.split('/');

        moduleFolder = toKebabCase(moduleFolder);
        const folderName = toKebabCase(repositoryName);
        repositoryName = toPascalCase(repositoryName);
        const fileName = `${directory.src}/${moduleFolder}/${folderName}/${repositoryName}Repository.ts`;
        if (file.exists(fileName))
          return `${repositoryName}Repository already exists`;
      },
    });

    if (isCanceled(repository)) {
      log.error(color.red('Repository creation canceled'));
      return;
    }

    const [module, name] = repository.split('/');

    const { repositoryName, moduleName, moduleFolder } = await createRepository(
      {
        name,
        moduleName: module,
        srcDir: directory.src,
        repositoryDir: directory.repository,
      },
    );

    log.success(color.green(`${repositoryName} created`));
    log.message(
      color.reset(
        color.dim(`${icon.success} ${moduleFolder}/${directory.repository}/${repositoryName}.ts was created
${icon.success} ${directory.repository}/${repositoryName}.ts was imported to ${moduleFolder}/${moduleName}.ts`),
      ),
    );
  }
}
