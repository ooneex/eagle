import { green } from 'jsr:@std/fmt@1.0.3/colors';
import { toKebabCase } from 'jsr:@std/text@1.0.8/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text@1.0.8/to-pascal-case';
import { toSnakeCase } from 'jsr:@std/text@1.0.8/to-snake-case';
import {
  cancel,
  isCancel,
  outro,
  select,
  text,
} from 'npm:@clack/prompts@0.8.2';
import pluralize from 'npm:pluralize@8.0.0';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';
import { repositoryTemplate } from './repository.template.ts';

/**
 * Options for creating a new schema
 */
type SchemaMakerOptionsType = {
  /** Name of the module to create schema in */
  moduleName?: string;
  /** Name of the schema */
  name?: string;
};

/**
 * Utility class for creating new database schemas
 */
export class SchemaMaker {
  /**
   * Creates a new database schema with associated repository and module files
   *
   * @param options - Options for creating the schema (moduleName and name)
   * @returns Promise that resolves when schema is created
   */
  public static async execute(
    options?: SchemaMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let schemaName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/src`;

    // If no module name provided, prompt user to select from existing modules
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

    // Handle cancellation
    if (isCancel(moduleName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    const moduleFolderName = toKebabCase(moduleName);
    moduleName = toPascalCase(moduleName);

    // If no schema name provided, prompt user for name
    if (!schemaName) {
      schemaName = (await text({
        message: 'Schema name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const schemaName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/schemas/${schemaName}Schema.ts`,
          );

          if (file.exists()) {
            return `${schemaName}Schema already exists!`;
          }
        },
      })) as string;
    }

    // Handle cancellation
    if (isCancel(schemaName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    schemaName = toPascalCase(schemaName);

    // Create schema file
    let file = new File(
      `${srcDir}/${moduleFolderName}/schemas/${schemaName}Schema.ts`,
    );
    await file.write(
      `import { Base } from '@/shared/schemas/BaseSchema.ts';
import { pgTable } from 'drizzle-orm/pg-core';

export const ${schemaName} = pgTable('${toSnakeCase(pluralize(schemaName))}', {
  ...Base,
});

export type ${schemaName}Type = typeof ${schemaName}.$inferSelect;
export type ${schemaName}MutationType = typeof ${schemaName}.$inferInsert;
`,
    );

    // Create repository file
    file = new File(
      `${srcDir}/${moduleFolderName}/repositories/${schemaName}Repository.ts`,
    );
    await file.write(repositoryTemplate(moduleFolderName, schemaName));

    // Update module file
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './repositories/${schemaName}Repository.ts';\n`,
      { append: true },
    );

    // Update schemas index file
    file = new File(`${srcDir}/shared/databases/schemas.ts`);
    await file.write(
      `export { ${schemaName} } from '@/${moduleFolderName}/schemas/${schemaName}Schema.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${schemaName}Schema created successfully!`));
  }
}
