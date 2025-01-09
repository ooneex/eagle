import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { SeedDecoratorException } from './SeedDecoratorException.ts';
import { SeedContainer } from './container.ts';

export const seed = (options?: {
  scope?: DecoratorScopeType;
  order?: number;
}): ClassDecorator => {
  return (seed: any) => {
    const name = seed.prototype.constructor.name;
    ensureIsSeed(name, seed);

    if (options?.scope === 'request') {
      container.bind(seed).toSelf().inRequestScope();
    } else if (options?.scope === 'transient') {
      container.bind(seed).toSelf().inTransientScope();
    } else {
      container.bind(seed).toSelf().inSingletonScope();
    }

    SeedContainer.add({
      value: seed,
      order: options?.order ?? 0,
    });
  };
};

const ensureIsSeed = (name: string, seed: any): void => {
  if (!name.endsWith('Seed') || !seed.prototype.execute) {
    throw new SeedDecoratorException(
      `Seed decorator can only be used on seed classes. ${name} must end with Seed keyword and implement ISeed interface.`,
    );
  }
};
