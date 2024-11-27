import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { outro, select, text } from 'npm:@clack/prompts';
import { ControllerMethodType } from '../controller/types.ts';
import { File } from '../file/File.ts';
import { trim } from '../helper/trim.ts';
import { AssertName } from '../validation/mod.ts';

type ControllerMakerOptionsType = {
  moduleName?: string;
  name?: string;
  method?: ControllerMethodType;
  path?: string;
};

export class ControllerMaker {
  public static async execute(
    options?: ControllerMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let controllerName = options?.name ?? null;
    let method = options?.method ?? null;
    let path = options?.path ?? null;
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

    controllerName = toPascalCase(controllerName);

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
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './controllers/${controllerName}Controller.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${controllerName}Controller created successfully!`));
  }
}
