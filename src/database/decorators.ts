import { container } from '../container/Container.ts';
import { ServiceDecoratorException } from '../service/ServiceDecoratorException.ts';

export const database = () => {
  return (database: any) => {
    const name = database.prototype.constructor.name;
    ensureIsDatabase(name, database);

    const db = new database();

    container.add(name, db, {
      scope: 'database',
      singleton: true,
      instance: true,
    });
  };
};

export const repository = () => {
  return (repository: any) => {
    const name = repository.prototype.constructor.name;
    ensureIsRepository(name, repository);

    container.add(name, repository, {
      scope: 'repository',
      singleton: true,
      instance: false,
    });
  };
};

const ensureIsDatabase = (name: string, database: any) => {
  if (
    !name?.endsWith('Database') ||
    !database.prototype.getDataSource
  ) {
    throw new ServiceDecoratorException(
      `Database decorator can only be used on database classes. ${name} must end with Database keyword and implement IDatabase interface.`,
    );
  }
};

const ensureIsRepository = (name: string, repository: any) => {
  if (
    !name?.endsWith('Repository') ||
    !repository.prototype.getRepository
  ) {
    throw new ServiceDecoratorException(
      `Repository decorator can only be used on repository classes. ${name} must end with Repository keyword and implement IRepository interface.`,
    );
  }
};
