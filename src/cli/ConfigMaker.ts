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

/**
 * Options for creating a new config file
 */
type ConfigMakerOptionsType = {
  /** Name of the module to create config in */
  moduleName?: string;
  /** Name of the config to create */
  name?: string;
};

/**
 * Creates new config files for modules
 */
export class ConfigMaker {
  /**
   * Creates a new config file in the specified module
   * @param options Configuration options
   * @returns Promise that resolves when config is created
   */
  public static async execute(
    options?: ConfigMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let configName = options?.name ?? null;
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

    if (!configName) {
      configName = (await text({
        message: 'Config name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const configName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/config/${configName}Config.ts`,
          );

          if (file.exists()) {
            return `${configName}Config already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(configName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    configName = toPascalCase(configName);

    let file = new File(
      `${srcDir}/${moduleFolderName}/config/${configName}Config.ts`,
    );
    await file.write(`import { config, IConfig } from '@ooneex/eagle/config';
import { ScalarType } from '@ooneex/eagle/types';

@config()
export class ${configName}Config implements IConfig {
  public toJson(): Record<string, ScalarType | null> {
    return {};
  }
}
`);
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './config/${configName}Config.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${configName}Config created successfully!`));
  }
}
