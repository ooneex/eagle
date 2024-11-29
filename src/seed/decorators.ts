import { container } from '../container/Container.ts';
import { SeedContainer } from './container.ts';
import { SeedDecoratorException } from './SeedDecoratorException.ts';

export const seed = () => {
  return (seed: any) => {
    const name = seed.prototype.constructor.name;
    ensureIsSeed(name, seed);

    SeedContainer.add(name);

    container.add(name, seed, {
      scope: 'seed',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsSeed = (name: string, seed: any) => {
  if (
    !name.endsWith('Seed') ||
    !seed.prototype.execute ||
    !seed.prototype.getOrder
  ) {
    throw new SeedDecoratorException(
      `Seed decorator can only be used on seed classes. ${name} must end with Seed keyword and implement ISeed interface.`,
    );
  }
};
