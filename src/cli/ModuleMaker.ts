import { green } from 'jsr:@std/fmt@1.0.3/colors';
import { toKebabCase } from 'jsr:@std/text@1.0.8/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text@1.0.8/to-pascal-case';
import { cancel, isCancel, outro, text } from 'npm:@clack/prompts@0.8.2';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

/**
 * Utility class for creating new modules
 */
export class ModuleMaker {
  /**
   * Creates a new module with the specified name
   *
   * @param value Optional initial module name value
   * @returns Promise that resolves when module is created
   */
  public static async execute(value?: string): Promise<void> {
    let folderName = '';
    let moduleName = '';
    const srcDir = `${Deno.cwd()}/src`;

    // Prompt for module name
    moduleName = (await text({
      message: 'Module name',
      placeholder: '',
      initialValue: value ?? '',
      validate(value) {
        const result = new AssertName().validate(value);
        if (!result.success) return result.message;

        folderName = toKebabCase(value);
        moduleName = toPascalCase(folderName);
        const file = new File(`${srcDir}/${folderName}/${moduleName}Module.ts`);

        if (file.exists()) return `${moduleName} already exists!`;
      },
    })) as string;

    // Handle cancellation
    if (isCancel(moduleName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    moduleName = toPascalCase(moduleName);

    // Create module file
    let file = new File(`${srcDir}/${folderName}/${moduleName}Module.ts`);
    await file.write(``);

    // Add module import to modules.ts
    file = new File(`${srcDir}/modules.ts`);
    await file.write(
      `import './${folderName}/${moduleName}Module.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${moduleName}Module created successfully!`));
  }
}
