import { register } from '../app/register.ts';
import { EagleConfigType } from '../app/types.ts';
import { handleEnvValidation } from '../app/utils.ts';
import { container } from '../container/Container.ts';
import { DocContainer } from '../doc/container.ts';
import { Doc } from '../doc/Doc.ts';
import { File } from '../file/File.ts';
import { FixtureContainer } from '../fixture/container.ts';
import { IFixture } from '../fixture/types.ts';

export class Fixture {
  private readonly config?: EagleConfigType;

  constructor(config?: EagleConfigType) {
    this.config = config;
  }

  public async run(): Promise<void> {
    await register();

    if (this.config?.validators) {
      handleEnvValidation(this.config.validators);
    }

    const file = new File(`${Deno.cwd()}/fixtures`);
    const fixtures = file.list({
      recursive: true,
      match: /Fixture\.ts$/,
    });

    for (const fixture of fixtures) {
      await import(fixture);

      const doc = new Doc(fixture);
      const data = await doc.parse();

      for (const datum of data) {
        const d = new Doc();
        d.setDocs([datum]);

        DocContainer.add(datum.name, d);
      }
    }

    const fixtureCollection: IFixture[] = [];

    for (const fixture of FixtureContainer) {
      const f = container.get<IFixture>(fixture, 'fixture');
      if (f) {
        fixtureCollection.push(f);
      }
    }

    fixtureCollection.sort((a, b) => a.getOrder() - b.getOrder());

    for (const fixture of fixtureCollection) {
      await fixture.execute();
    }
  }
}
