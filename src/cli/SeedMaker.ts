import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { cancel, isCancel, outro, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { trim } from '../helper/trim.ts';

type SeedMakerOptionsType = {
  name?: string;
};

export class SeedMaker {
  public static async execute(
    options?: SeedMakerOptionsType,
  ): Promise<void> {
    let seedName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/seeds`;

    if (!seedName) {
      seedName = (await text({
        message: 'Seed name',
        validate(value) {
          value = trim(value);
          if (!/^[a-z0-9-\/]*$/i.test(value)) {
            return 'Invalid seed name';
          }

          const paths = value.split('/').map((path) => toKebabCase(path));
          paths[paths.length - 1] = toPascalCase(paths[paths.length - 1]);

          value = paths.join('/');

          const file = new File(`${srcDir}/${value}Seed.ts`);

          if (file.exists()) {
            return `${value}Seed already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(seedName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    const paths = seedName.split('/').map((path) => toKebabCase(path));
    const name = toPascalCase(paths[paths.length - 1]);
    paths[paths.length - 1] = name;
    seedName = paths.join('/');

    const file = new File(`${srcDir}/${seedName}Seed.ts`);
    await file.write(`import { seed, ISeed } from 'eagle/seed';

@seed()
export class ${name}Seed implements ISeed {
  public execute(previousData: unknown): unknown {
    // TODO: Add seed data here
    return previousData;
  }

  public getOrder(): number {
    return 1;
  }
}
`);

    outro(green(`\u2713 ${seedName}Seed created successfully!`));
  }
}
