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
 * Options for creating a new mailer
 */
type MailerMakerOptionsType = {
  /** Name of the module to create the mailer in */
  moduleName?: string;
  /** Name of the mailer to create */
  name?: string;
};

/**
 * Creates new mailer classes
 */
export class MailerMaker {
  /**
   * Executes the mailer creation process
   * @param options Configuration options for creating the mailer
   * @returns Promise that resolves when mailer is created
   */
  public static async execute(
    options?: MailerMakerOptionsType,
  ): Promise<void> {
    let moduleName = options?.moduleName ?? null;
    let mailerName = options?.name ?? null;
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

    if (!mailerName) {
      mailerName = (await text({
        message: 'Mailer name',
        validate(value) {
          const result = new AssertName().validate(value);
          if (!result.success) return result.message;

          const mailerName = toPascalCase(value);
          const file = new File(
            `${srcDir}/${moduleFolderName}/mailers/${mailerName}Mailer.ts`,
          );

          if (file.exists()) {
            return `${mailerName}Mailer already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(mailerName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    mailerName = toPascalCase(mailerName);

    let file = new File(
      `${srcDir}/${moduleFolderName}/mailers/${mailerName}Mailer.ts`,
    );
    await file.write(`import { EnvConfig } from 'eagle/config';
import { BrevoMailer, DevMailer, IMailer, mailer } from 'eagle/mailer';

@mailer()
export class ${mailerName}Mailer implements IMailer {
  constructor(
    private readonly brevoMailer: BrevoMailer,
    private readonly devMailer: DevMailer,
    private readonly env: EnvConfig,
  ) {}

  public async send<T = void>(): Promise<T> {
    if (this.env.app.isLocal) {
      return await this.devMailer.send();
    }

    return await this.brevoMailer.send();
  }
}
`);
    file = new File(`${srcDir}/${moduleFolderName}/${moduleName}Module.ts`);
    await file.write(
      `import './mailers/${mailerName}Mailer.ts';\n`,
      { append: true },
    );

    outro(green(`\u2713 ${mailerName}Mailer created successfully!`));
  }
}
