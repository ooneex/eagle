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
import {
  AssertName,
  ValidatorScopes,
  ValidatorScopeType,
} from '../validation/mod.ts';

/**
 * Options for creating a new validator
 */
type ValidatorMakerOptionsType = {
  /** Name of the module to create validator in */
  moduleName?: string;
  /** Name of the validator */
  name?: string;
  /** Scope of the validator */
  scope?: ValidatorScopeType;
};

/**
 * Creates a new validator class file and registers it with a module
 */
export class ValidatorMaker {
  /**
   * Creates a new validator
   * @param options Options for creating the validator
   */
  public static async execute(
    options?: ValidatorMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let validatorName = options?.name ?? null;
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

    if (isCancel(moduleName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    const moduleFolderName = toKebabCase(moduleName);
    moduleName = toPascalCase(moduleName);

    if (!validatorName) {
      validatorName = (await text({
        message: 'Validator name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const validatorName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/validators/${validatorName}Validator.ts`,
          );

          if (file.exists()) {
            return `${validatorName}Validator already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(validatorName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    validatorName = toPascalCase(validatorName);

    if (!scope) {
      const options: { value: string; label: string }[] = [];
      for (const s of ValidatorScopes) {
        options.push({ value: s, label: s });
      }

      scope = (await select({
        message: 'Scope',
        options,
      })) as ValidatorScopeType;
    }

    if (isCancel(scope)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    let file = new File(
      `${srcDir}/${moduleFolderName}/validators/${validatorName}Validator.ts`,
    );
    await file.write(
      `import {
  AbstractValidator,
  validator,
  ValidatorScopeType,
} from '@ooneex/eagle/validation';

@validator()
export class ${validatorName}Validator extends AbstractValidator {
  // TODO: Implement validation

  public getScope(): ValidatorScopeType {
    return '${scope}';
  }
}
`,
    );
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './validators/${validatorName}Validator.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${validatorName}Validator created successfully!`));
  }
}
