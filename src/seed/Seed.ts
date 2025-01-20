import { container } from '../container';
import { SeedContainer } from './container';
import type { ISeed } from './types';

export class Seed {
  public async run(): Promise<void> {
    const seeds = Array.from(SeedContainer.values()).sort(
      (a, b) => a.order - b.order,
    );

    let previousData: unknown | undefined = undefined;

    for (const seed of seeds) {
      const instance = container.get<ISeed>(seed.value);
      previousData = await instance.execute(previousData);
    }
  }
}
