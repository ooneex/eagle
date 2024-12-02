/**
 * Imports required dependencies for middleware creation
 */
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
import { MiddlewareScopes, MiddlewareScopeType } from '../middleware/types.ts';
import { AssertName } from '../validation/mod.ts';

/**
 * Type definition for middleware maker options
 */
type MiddlewareMakerOptionsType = {
  moduleName?: string; // Optional module name
  name?: string; // Optional middleware name
  scope?: MiddlewareScopeType; // Optional middleware scope
};

/**
 * Class responsible for creating new middleware files
 */
export class MiddlewareMaker {
  /**
   * Creates a new middleware file with boilerplate code
   * @param options Optional configuration for middleware creation
   */
  public static async execute(
    options?: MiddlewareMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let middlewareName = options?.name ?? null;
    let scope = options?.scope ?? null;
    const srcDir = `${Deno.cwd()}/src`;

    // If no module name provided, show selection prompt
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

    // If no middleware name provided, show text input prompt
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

    if (isCancel(middlewareName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    middlewareName = toPascalCase(middlewareName);

    // If no scope provided, show selection prompt
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

    if (isCancel(scope)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    // Create middleware file with template
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

    // Update module file to import new middleware
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './middlewares/${middlewareName}Middleware.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${middlewareName}Middleware created successfully!`));
  }
}
