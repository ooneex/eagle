import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { cancel, isCancel, outro, select, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { AssertName } from '../validation/mod.ts';

type PermissionMakerOptionsType = {
  moduleName?: string;
  name?: string;
};

export class PermissionMaker {
  public static async execute(
    options?: PermissionMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let permissionName = options?.name ?? null;
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

    if (!permissionName) {
      permissionName = (await text({
        message: 'Permission name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const permissionName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/permissions/${permissionName}Permission.ts`,
          );

          if (file.exists()) {
            return `${permissionName}Permission already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(permissionName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    permissionName = toPascalCase(permissionName);

    const file = new File(
      `${srcDir}/${moduleFolderName}/permissions/${permissionName}Permission.ts`,
    );
    await file.write(
      `import { IPermission, IUser } from 'eagle/security';

export class ${permissionName}Permission implements IPermission {
  public check(user?: IUser): boolean {
    console.log(user);

    return true;
  }

  public getErrorMessage(user?: IUser): string {
    console.log(user);

    return '';
  }
}
`,
    );

    outro(green(`\u2713 ${permissionName}Permission created successfully!`));
  }
}
