import { green } from 'jsr:@std/fmt@1.0.3/colors';
import { toKebabCase } from 'jsr:@std/text@1.0.8/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text@1.0.8/to-pascal-case';
import {
  cancel,
  isCancel,
  outro,
  select,
  text,
} from 'npm:@clack/prompts@0.8.2';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';
import { repositoryTemplate } from './repository.template.ts';

/**
 * Options for creating a new repository
 */
type RepositoryMakerOptionsType = {
  /** Name of the module to create repository in */
  moduleName?: string;
  /** Name of the repository to create */
  name?: string;
};

/**
 * Creates a new repository file and adds it to a module
 */
export class RepositoryMaker {
  /**
   * Creates a new repository with the given options
   *
   * If options are not provided, will prompt user for input
   *
   * @param options Optional configuration for repository creation
   */
  public static async execute(
    options?: RepositoryMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let repositoryName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/src`;

    if (!moduleName) {
      const modules = new File(srcDir).list({ directory: true });
      const options: { value: string; label: string }[] = [];
      for (const module of modules) {
        const m = module.replace(`${srcDir}/`, '');
        options.push({ value: m, label: m });
      }

      moduleName = (await select({
        message: 'Module',
        options,
      })) as string;
    }

    if (isCancel(moduleName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    const moduleFolderName = toKebabCase(moduleName);
    moduleName = toPascalCase(moduleName);

    if (!repositoryName) {
      repositoryName = (await text({
        message: 'Repository name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const repositoryName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/repositories/${repositoryName}Repository.ts`,
          );

          if (file.exists()) {
            return `${repositoryName}Repository already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(repositoryName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    repositoryName = toPascalCase(repositoryName);

    let file = new File(
      `${srcDir}/${moduleFolderName}/repositories/${repositoryName}Repository.ts`,
    );
    await file.write(repositoryTemplate(moduleFolderName, repositoryName));
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './repositories/${repositoryName}Repository.ts';\n`,
      { append: true },
    );

    outro(
      green(`\u2713 ${repositoryName}Repository created successfully!`),
    );
  }
}
