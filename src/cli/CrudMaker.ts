import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { cancel, isCancel, outro, select, text } from 'npm:@clack/prompts';
import pluralize from 'npm:pluralize';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

type CrudMakerOptionsType = {
  moduleName?: string;
  name?: string;
};

export class CrudMaker {
  public static async execute(
    options?: CrudMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let controllerName = options?.name ?? null;
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

    const path = `/${toKebabCase(pluralize(controllerName))}`;

    const methods = [
      { value: 'Get', param: '', name: 'List' },
      { value: 'Get', param: '/:id', name: 'Get' },
      { value: 'Post', param: '', name: 'Post' },
      { value: 'Put', param: '/:id', name: 'Put' },
      { value: 'Patch', param: '/:id', name: 'Patch' },
      { value: 'Delete', param: '/:id', name: 'Delete' },
    ];

    for (const method of methods) {
      const controllerFolderName = toKebabCase(controllerName);
      const controller = `${method.name}${controllerName}`;
      let file = new File(
        `${srcDir}/${moduleFolderName}/controllers/${controllerFolderName}/${controller}Controller.ts`,
      );
      let content = "return response.json({ id: request.params.get('id') });";

      if (method.param === '') {
        content = 'return response.json({ params: request.params.toJson() });';
      }

      await file.write(
        `import { IController, ${method.value} } from 'eagle/controller';
import { IRequest } from 'eagle/request';
import { IResponse } from 'eagle/response';

@${method.value}('${path}${method.param}')
export class ${method.name}${controllerName}Controller implements IController {
  public action(response: IResponse, request: IRequest) {
    ${content}
  }
}
`,
      );
      file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
      await file.write(
        `import './controllers/${controllerFolderName}/${controller}Controller.ts';\n`,
        { append: true },
      );
    }

    outro(green(`\u2713 Resources created successfully!`));
  }
}
