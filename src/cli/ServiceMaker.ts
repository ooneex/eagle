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
 * Options for creating a new service
 */
type ServiceMakerOptionsType = {
  /** The name of the module to create the service in */
  moduleName?: string;
  /** The name of the service to create */
  name?: string;
};

/**
 * Utility class for creating new services
 */
export class ServiceMaker {
  /**
   * Creates a new service in the specified module
   *
   * @param options Options for creating the service
   */
  public static async execute(
    options?: ServiceMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let serviceName = options?.name ?? null;
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

    if (!serviceName) {
      serviceName = (await text({
        message: 'Service name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const serviceName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/services/${serviceName}Service.ts`,
          );

          if (file.exists()) {
            return `${serviceName}Service already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(serviceName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    serviceName = toPascalCase(serviceName);

    let file = new File(
      `${srcDir}/${moduleFolderName}/services/${serviceName}Service.ts`,
    );
    await file.write(`import { IService, service } from '@ooneex/eagle/service';

@service()
export class ${serviceName}Service implements IService {
  // TODO: Implement service
}
`);
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './services/${serviceName}Service.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${serviceName}Service created successfully!`));
  }
}
