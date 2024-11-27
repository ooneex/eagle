import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { outro, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

export class ModuleMaker {
  public static async execute(value?: string): Promise<void> {
    let folderName = '';
    let moduleName = '';
    const srcDir = `${Deno.cwd()}/src`;

    await text({
      message: 'Module name',
      placeholder: '',
      initialValue: value ?? '',
      validate(value) {
        const result = new AssertName().validate(value);
        if (!result.success) return result.message;

        folderName = toKebabCase(value);
        moduleName = toPascalCase(`${folderName}`);
        const file = new File(`${srcDir}/${folderName}/${moduleName}Module.ts`);

        if (file.exists()) return `${moduleName} already exists!`;
      },
    });

    let file = new File(`${srcDir}/${folderName}/${moduleName}Module.ts`);
    await file.write(``);
    file = new File(`${srcDir}/modules.ts`);
    await file.write(
      `import './${folderName}/${moduleName}Module.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${moduleName}Module created successfully!`));
  }
}
