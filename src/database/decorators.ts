import { container } from '../container/Container.ts';
import { DatabaseDecoratorException } from './DatabaseDecoratorException.ts';
import { RepositoryDecoratorException } from './RepositoryDecoratorException.ts';
import { VectorDatabaseDecoratorException } from './vector/VectorDatabaseDecoratorException.ts';

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

export const vector = () => {
  return (vectorDatabase: any) => {
    const name = vectorDatabase.prototype.constructor.name;
    ensureIsVectorDatabase(name);

    container.add(name, vectorDatabase, {
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
    throw new DatabaseDecoratorException(
      `Database decorator can only be used on database classes. ${name} must end with Database keyword.`,
    );
  }
};

const ensureIsVectorDatabase = (name: string) => {
  if (!name?.endsWith('VectorDatabase')) {
    throw new VectorDatabaseDecoratorException(
      `VectorDatabase decorator can only be used on vector database classes. ${name} must end with VectorDatabase keyword.`,
    );
  }
};

const ensureIsRepository = (name: string) => {
  if (!name?.endsWith('Repository')) {
    throw new RepositoryDecoratorException(
      `Repository decorator can only be used on repository classes. ${name} must end with Repository keyword.`,
    );
  }
};
