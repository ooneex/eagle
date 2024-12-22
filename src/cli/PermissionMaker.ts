/**
 * Import required dependencies for the permission maker
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
import { AssertName } from '../validation/mod.ts';

/**
 * Options that can be passed to the permission maker
 */
type PermissionMakerOptionsType = {
  /** Optional module name to create permission in */
  moduleName?: string;
  /** Optional permission name to create */
  name?: string;
};

/**
 * Class for creating permission files in a modular structure
 */
export class PermissionMaker {
  /**
   * Creates a new permission file with boilerplate code
   *
   * @param options - Optional configuration for permission creation
   */
  public static async execute(
    options?: PermissionMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let permissionName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/src`;

    // If no module name provided, list available modules for selection
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

    // Handle cancellation
    if (isCancel(moduleName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    const moduleFolderName = toKebabCase(moduleName);
    moduleName = toPascalCase(moduleName);

    // If no permission name provided, prompt for one
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

    // Handle cancellation
    if (isCancel(permissionName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    permissionName = toPascalCase(permissionName);

    // Create and write the permission file
    const file = new File(
      `${srcDir}/${moduleFolderName}/permissions/${permissionName}Permission.ts`,
    );
    await file.write(
      `import { IPermission, IUser } from '@ooneex/eagle/security';

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
