import { container } from '../container';
import type { DecoratorScopeType } from '../types';
import { DatabaseDecoratorException } from './DatabaseDecoratorException';
import { RepositoryDecoratorException } from './RepositoryDecoratorException';

export const database = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (database: any) => {
    const name = database.prototype.constructor.name;
    ensureIsDatabase(name);

    if (options?.scope === 'transient') {
      container.bind(database).toSelf().inTransientScope();
    } else {
      container.bind(database).toSelf().inSingletonScope();
    }
  };
};

export const repository = (options?: {
  scope?: DecoratorScopeType;
}): ClassDecorator => {
  return (repository: any) => {
    const name = repository.prototype.constructor.name;
    ensureIsRepository(name);

    if (options?.scope === 'transient') {
      container.bind(repository).toSelf().inTransientScope();
    } else {
      container.bind(repository).toSelf().inSingletonScope();
    }
  };
};

const ensureIsDatabase = (name: string): void => {
  if (!name?.endsWith('Database')) {
    throw new DatabaseDecoratorException(
      `Database decorator can only be used on database classes. ${name} must end with Database keyword.`,
    );
  }
};

const ensureIsRepository = (name: string): void => {
  if (!name?.endsWith('Repository')) {
    throw new RepositoryDecoratorException(
      `Repository decorator can only be used on repository classes. ${name} must end with Repository keyword.`,
    );
  }
};
