import { register } from '../app/register.ts';
import { EagleConfigType } from '../app/types.ts';
import { handleEnvValidation } from '../app/utils.ts';
import { container } from '../container/Container.ts';
import { DocContainer } from '../doc/container.ts';
import { Doc } from '../doc/Doc.ts';
import { File } from '../file/File.ts';
import { SeedContainer } from './container.ts';
import { ISeed } from './types.ts';

export class Seed {
  private readonly config?: EagleConfigType;

  constructor(config?: EagleConfigType) {
    this.config = config;
  }

  public async run(): Promise<void> {
    await register();

    if (this.config?.validators) {
      handleEnvValidation(this.config.validators);
    }

    const file = new File(`${Deno.cwd()}/seeds`);
    const seeds = file.list({
      recursive: true,
      match: /Seed\.ts$/,
    });

    for (const seed of seeds) {
      await import(seed);

      const doc = new Doc(seed);
      const data = await doc.parse();

      for (const datum of data) {
        const d = new Doc();
        d.setDocs([datum]);

        DocContainer.add(datum.name, d);
      }
    }

    const fixtureCollection: ISeed[] = [];

    for (const seed of SeedContainer) {
      const f = container.get<ISeed>(seed, 'seed');
      if (f) {
        fixtureCollection.push(f);
      }
    }

    fixtureCollection.sort((a, b) => a.getOrder() - b.getOrder());

    let data: unknown | undefined = undefined;
    for (const fixture of fixtureCollection) {
      data = await fixture.execute(data);
    }
  }
}