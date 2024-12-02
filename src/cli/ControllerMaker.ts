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
import { ControllerMethodType } from '../controller/types.ts';
import { File } from '../file/File.ts';
import { trim } from '../helper/trim.ts';
import { AssertName } from '../validation/mod.ts';

/**
 * Options that can be passed to the ControllerMaker
 */
type ControllerMakerOptionsType = {
  moduleName?: string;
  name?: string;
  method?: ControllerMethodType;
  path?: string;
};

/**
 * Class responsible for creating new controllers
 */
export class ControllerMaker {
  /**
   * Creates a new controller with the given options
   *
   * @param options - Configuration options for the controller
   * @returns Promise that resolves when controller is created
   */
  public static async execute(
    options?: ControllerMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let controllerName = options?.name ?? null;
    let method = options?.method ?? null;
    let path = options?.path ?? null;
    const srcDir = `${Deno.cwd()}/src`;

    // If no module specified, prompt user to select one
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

    // Prompt for controller name if not provided
    if (!controllerName) {
      controllerName = (await text({
        message: 'Controller name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const controllerName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/controllers/${controllerName}Controller.ts`,
          );

          if (file.exists()) {
            return `${controllerName}Controller already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(controllerName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    controllerName = toPascalCase(controllerName);

    // Prompt for HTTP method if not specified
    if (!method) {
      method = (await select({
        message: 'Method',
        options: [
          { value: 'Get', label: 'GET' },
          { value: 'Post', label: 'POST' },
          { value: 'Put', label: 'PUT' },
          { value: 'Patch', label: 'PATCH' },
          { value: 'Delete', label: 'DELETE' },
          { value: 'Head', label: 'HEAD' },
          { value: 'Options', label: 'OPTIONS' },
        ],
      })) as ControllerMethodType;
    }

    if (isCancel(method)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    // Prompt for route path if not provided
    if (!path) {
      path = (await text({
        message: 'Path',
        validate(value) {
          value = trim(value);
          if (!/^\/[a-z0-9-\/:]*$/i.test(value)) {
            return 'Invalid path';
          }
        },
      })) as string;
    }

    if (isCancel(path)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    // Create the controller file
    let file = new File(
      `${srcDir}/${moduleFolderName}/controllers/${controllerName}Controller.ts`,
    );
    await file.write(`import { IController, ${method} } from 'eagle/controller';
import { IRequest } from 'eagle/request';
import { IResponse } from 'eagle/response';

@${method}('${path}')
export class ${controllerName}Controller implements IController {
  public action(response: IResponse, request: IRequest) {
    return response.json({ params: request.params });
  }
}
`);

    // Update the module file to import the new controller
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './controllers/${controllerName}Controller.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${controllerName}Controller created successfully!`));
  }
}
