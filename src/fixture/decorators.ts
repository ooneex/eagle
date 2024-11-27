import { container } from '../container/Container.ts';
import { FixtureContainer } from './container.ts';
import { FixtureDecoratorException } from './FixtureDecoratorException.ts';

export const fixture = () => {
  return (fixture: any) => {
    const name = fixture.prototype.constructor.name;
    ensureIsFixture(name, fixture);

    FixtureContainer.add(name);

    container.add(name, fixture, {
      scope: 'fixture',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsFixture = (name: string, fixture: any) => {
  if (
    !name.endsWith('Fixture') ||
    !fixture.prototype.execute ||
    !fixture.prototype.getOrder
  ) {
    throw new FixtureDecoratorException(
      `Fixture decorator can only be used on fixture classes. ${name} must end with Fixture keyword and implement IFixture interface.`,
    );
  }
};
