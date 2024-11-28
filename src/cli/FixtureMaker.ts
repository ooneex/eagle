import { green } from 'jsr:@std/fmt/colors';
import { toKebabCase } from 'jsr:@std/text/to-kebab-case';
import { toPascalCase } from 'jsr:@std/text/to-pascal-case';
import { cancel, isCancel, outro, text } from 'npm:@clack/prompts';
import { File } from '../file/File.ts';
import { trim } from '../helper/trim.ts';

type FixtureMakerOptionsType = {
  name?: string;
};

export class FixtureMaker {
  public static async execute(
    options?: FixtureMakerOptionsType,
  ): Promise<void> {
    let fixtureName = options?.name ?? null;
    const srcDir = `${Deno.cwd()}/fixtures`;

    if (!fixtureName) {
      fixtureName = (await text({
        message: 'Fixture name',
        validate(value) {
          value = trim(value);
          if (!/^[a-z0-9-\/]*$/i.test(value)) {
            return 'Invalid fixture name';
          }

          const paths = value.split('/').map((path) => toKebabCase(path));
          paths[paths.length - 1] = toPascalCase(paths[paths.length - 1]);

          value = paths.join('/');

          const file = new File(`${srcDir}/${value}Fixture.ts`);

          if (file.exists()) {
            return `${value}Fixture already exists!`;
          }
        },
      })) as string;
    }

    if (isCancel(fixtureName)) {
      cancel('Cancelled!');
      Deno.exit(0);
    }

    const paths = fixtureName.split('/').map((path) => toKebabCase(path));
    const name = toPascalCase(paths[paths.length - 1]);
    paths[paths.length - 1] = name;
    fixtureName = paths.join('/');

    const file = new File(`${srcDir}/${fixtureName}Fixture.ts`);
    await file.write(`import { fixture, IFixture } from 'eagle/fixture';

@fixture()
export class ${name}Fixture implements IFixture {
  public execute(): void {
    // TODO: Add fixture data here
  }

  public getOrder(): number {
    return 1;
  }
}
`);

    outro(green(`\u2713 ${fixtureName}Fixture created successfully!`));
  }
}
