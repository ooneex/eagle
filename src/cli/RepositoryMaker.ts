import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { outro, select, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

type RepositoryMakerOptionsType = {
  moduleName?: string;
  name?: string;
};

export class RepositoryMaker {
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

    repositoryName = toPascalCase(repositoryName);

    let file = new File(
      `${srcDir}/${moduleFolderName}/repositories/${repositoryName}Repository.ts`,
    );
    await file.write(
      `import { MainDatabase } from '@/shared/databases/MainDatabase.ts';
import { repository } from 'eagle/database';

@repository()
export class ${repositoryName}Repository {
  private readonly source;

  constructor(database: MainDatabase) {
    this.source = database.getDataSource();
  }

  // TODO: Implement repository
}
`,
    );
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './repositories/${repositoryName}Repository.ts';`,
      { append: true },
    );

    outro(
      green(`\u2713 ${repositoryName}Repository created successfully!`),
    );
  }
}
