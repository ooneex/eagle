import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { cancel, isCancel, outro, select, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

type AssertMakerOptionsType = {
  moduleName?: string;
  name?: string;
};

export class AssertMaker {
  public static async execute(
    options?: AssertMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let assertName = options?.name ?? null;
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

    if (!assertName) {
      assertName = (await text({
        message: 'Assert name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const assertName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/validators/asserts/Assert${assertName}.ts`,
          );

          if (file.exists()) {
            return `Assert${assertName} already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(assertName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    assertName = toPascalCase(assertName);

    const file = new File(
      `${srcDir}/${moduleFolderName}/validators/asserts/Assert${assertName}.ts`,
    );
    await file.write(
      `import { assert, IAssert } from 'eagle/validation';

@assert()
export class Assert${assertName} implements IAssert {
  public validate(value: unknown) {
    return {
      success: true,
      message: 'Assert passed!',
    };
  }
}
`,
    );

    outro(green(`\u2713 Assert${assertName} created successfully!`));
  }
}
