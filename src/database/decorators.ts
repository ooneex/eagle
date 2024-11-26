import { container } from '../container/Container.ts';
import { ServiceDecoratorException } from '../service/ServiceDecoratorException.ts';

export const database = () => {
  return (database: any) => {
    const name = database.prototype.constructor.name;
    ensureIsDatabase(name);

    container.add(name, database, {
      scope: 'database',
      singleton: true,
      instance: false,
    });
  };
};

export const repository = () => {
  return (repository: any) => {
    const name = repository.prototype.constructor.name;
    ensureIsRepository(name);

    container.add(name, repository, {
      scope: 'repository',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsDatabase = (name: string) => {
  if (!name?.endsWith('Database')) {
    throw new ServiceDecoratorException(
      `Database decorator can only be used on database classes. ${name} must end with Database keyword.`,
    );
  }
};

const ensureIsRepository = (name: string) => {
  if (!name?.endsWith('Repository')) {
    throw new ServiceDecoratorException(
      `Repository decorator can only be used on repository classes. ${name} must end with Repository keyword.`,
    );
  }
};
