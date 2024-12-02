import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { SeedContainer } from './container.ts';
import { SeedDecoratorException } from './SeedDecoratorException.ts';

/**
 * Decorator factory for seed classes
 * @param options Configuration options for the seed
 * @param options.scope Optional scope type for the seed container
 * @param options.singleton Optional flag to make the seed a singleton
 * @returns Decorator function that registers the seed class
 */
export const seed = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}): ClassDecorator => {
  return (seed: any) => {
    const name = seed.prototype.constructor.name;
    ensureIsSeed(name, seed);

    SeedContainer.add(name);

    container.add(name, seed, {
      scope: options?.scope ?? 'seed',
      singleton: options?.singleton ?? true,
      instance: false,
    });
  };
};

/**
 * Validates that a class is a valid seed class
 * @param name The name of the class
 * @param seed The seed class to validate
 * @throws {SeedDecoratorException} If the class does not meet seed requirements
 */
const ensureIsSeed = (name: string, seed: any): void => {
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
