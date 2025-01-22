import { container } from '../container';
import { SeedContainer } from './container';
import type { ISeed } from './types';

import { intro, log, outro } from '@clack/prompts';
import * as icon from 'log-symbols';
import * as colors from '../command/colors';
import { toKebabCase, toPascalCase } from '../helper';

export class Seed {
  public async run(): Promise<void> {
    const seeds = Array.from(SeedContainer.values()).sort(
      (a, b) => a.order - b.order,
    );

    let previousData: unknown | undefined = undefined;

    for (const seed of seeds) {
      if (!seed.active) {
        continue;
      }

      const instance = container.get<ISeed>(seed.value);
      previousData = await instance.execute({
        previousData,
        log: {
          error: (message: string) => log.error(message),
          info: (message: string) => log.info(message),
          message: (message: string) => log.message(message),
          step: (message: string) => log.step(message),
          success: (message: string) => log.success(message),
          warning: (message: string) => log.warning(message),
          intro: (message: string) => intro(message),
          outro: (message: string) => outro(message),
        },
        color: colors,
        icon: icon.default,
        toPascalCase,
        toKebabCase,
      });
    }
  }
}
