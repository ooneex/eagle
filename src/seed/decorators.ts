import { container } from '../container';
import type { DecoratorScopeType } from '../types';
import { SeedDecoratorException } from './SeedDecoratorException';
import { SeedContainer } from './container';

export const seed = (options?: {
  scope?: DecoratorScopeType;
  order?: number;
  active?: boolean;
}): ClassDecorator => {
  return (seed: any) => {
    const name = seed.prototype.constructor.name;
    ensureIsSeed(name, seed);

    if (options?.scope === 'transient') {
      container.bind(seed).toSelf().inTransientScope();
    } else {
      container.bind(seed).toSelf().inSingletonScope();
    }

    SeedContainer.add({
      value: seed,
      order: options?.order ?? 0,
      active: options?.active ?? true,
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
