import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { toSnakeCase } from 'jsr:@std/text/to-snake-case';
import { cancel, isCancel, outro, select, text } from 'npm:@clack/prompts';
import pluralize from 'npm:pluralize';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

type SchemaMakerOptionsType = {
  moduleName?: string;
  name?: string;
};

export class SchemaMaker {
  public static async execute(
    options?: SchemaMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let schemaName = options?.name ?? null;
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

    if (isCancel(schemaName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    schemaName = toPascalCase(schemaName);

    const file = new File(
      `${srcDir}/${moduleFolderName}/schemas/${schemaName}Schema.ts`,
    );
    await file.write(
      `import { pgTable } from 'drizzle-orm/pg-core';

export const ${schemaName} = pgTable('${toSnakeCase(pluralize(schemaName))}', {
  // TODO: Implement schema
});

export type ${schemaName}Type = typeof ${schemaName}.$inferSelect;
export type ${schemaName}MutationType = typeof ${schemaName}.$inferInsert;
`,
    );

    outro(green(`\u2713 ${schemaName}Schema created successfully!`));
  }
}
