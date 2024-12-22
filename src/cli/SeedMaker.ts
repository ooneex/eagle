/**
 * Imports required dependencies for seed file creation and manipulation
 */
import { green } from 'jsr:@std/fmt@1.0.3/colors';
import { toKebabCase } from 'jsr:@std/text@1.0.8/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text@1.0.8/to-pascal-case';
import { cancel, isCancel, outro, text } from 'npm:@clack/prompts@0.8.2';
import { File } from '../file/File.ts';
import { trim } from '../helper/trim.ts';

/**
 * Options that can be passed to the SeedMaker
 */
type SeedMakerOptionsType = {
  /** Optional name for the seed file */
  name?: string;
};

/**
 * Class responsible for creating new seed files
 */
export class SeedMaker {
  /**
   * Creates a new seed file with boilerplate code
   *
   * @param options - Optional configuration options
   * @returns Promise that resolves when seed file is created
   */
  public static async execute(
    options?: SeedMakerOptionsType,
  ): Promise<void> {
    let seedName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/seeds`;

    // If no name provided, prompt for one
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

    // Handle cancellation
    if (isCancel(seedName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    // Format the seed name
    const paths = seedName.split('/').map((path) => toKebabCase(path));
    const name = toPascalCase(paths[paths.length - 1]);
    paths[paths.length - 1] = name;
    seedName = paths.join('/');

    // Create and write the seed file
    const file = new File(`${srcDir}/${seedName}Seed.ts`);
    await file.write(`import { seed, ISeed } from '@ooneex/eagle/seed';

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
