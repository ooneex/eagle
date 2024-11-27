import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { outro, select, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { MiddlewareScopes, MiddlewareScopeType } from '../middleware/types.ts';
import { AssertName } from '../validation/mod.ts';

type MiddlewareMakerOptionsType = {
  moduleName?: string;
  name?: string;
  scope?: MiddlewareScopeType;
};

export class MiddlewareMaker {
  public static async execute(
    options?: MiddlewareMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let middlewareName = options?.name ?? null;
    let scope = options?.scope ?? null;
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

    if (!middlewareName) {
      middlewareName = (await text({
        message: 'Middleware name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const middlewareName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/middlewares/${middlewareName}Middleware.ts`,
          );

          if (file.exists()) {
            return `${middlewareName}Middleware already exists!`;
          }
        },
      })) as string;
    }

    middlewareName = toPascalCase(middlewareName);

    if (!scope) {
      const options: { value: string; label: string }[] = [];
      for (const s of MiddlewareScopes) {
        options.push({ value: s, label: s });
      }

      scope = (await select({
        message: 'Scope',
        options,
      })) as MiddlewareScopeType;
    }

    let file = new File(
      `${srcDir}/${moduleFolderName}/middlewares/${middlewareName}Middleware.ts`,
    );
    await file.write(
      `import { IMiddleware, middleware, MiddlewareScopeType } from 'eagle/middleware';
import { IRequest } from 'eagle/request';
import { IResponse } from 'eagle/response';

@middleware()
export class ${middlewareName}Middleware implements IMiddleware {
  public execute(context: { request: IRequest; response: IResponse }): void {
    console.log(context);
    // TODO: Implement middleware
  }

  public getScope(): MiddlewareScopeType {
    return '${scope}';
  }

  public getOrder(): number {
    return 0;
  }
}
`,
    );
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './middlewares/${middlewareName}Middleware.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${middlewareName}Middleware created successfully!`));
  }
}
