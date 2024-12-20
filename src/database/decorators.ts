import { container } from '../container/Container.ts';
import { ContainerScopeType } from '../container/types.ts';
import { DatabaseDecoratorException } from './DatabaseDecoratorException.ts';
import { RepositoryDecoratorException } from './RepositoryDecoratorException.ts';

/**
 * Decorator for database classes.
 * Adds the database class to the container with specified scope and singleton settings.
 * Database class names must end with 'Database'.
 * @param options Configuration options for the database decorator
 * @param options.scope Container scope type (defaults to 'database')
 * @param options.singleton Whether the database should be singleton (defaults to true)
 */
export const database = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}): ClassDecorator => {
  return (database: any) => {
    const name = database.prototype.constructor.name;
    ensureIsDatabase(name);

    container.add(name, database, {
      scope: options?.scope ?? 'database',
      singleton: options?.singleton ?? true,
      instance: false,
    });
  };
};

/**
 * Decorator for repository classes.
 * Adds the repository class to the container with specified scope and singleton settings.
 * Repository class names must end with 'Repository'.
 * @param options Configuration options for the repository decorator
 * @param options.scope Container scope type (defaults to 'repository')
 * @param options.singleton Whether the repository should be singleton (defaults to true)
 */
export const repository = (options?: {
  scope?: ContainerScopeType;
  singleton?: boolean;
}): ClassDecorator => {
  return (repository: any) => {
    const name = repository.prototype.constructor.name;
    ensureIsRepository(name);

    container.add(name, repository, {
      scope: options?.scope ?? 'repository',
      singleton: options?.singleton ?? true,
      instance: false,
    });
  };
};

/**
 * Validates that a database class name ends with 'Database'
 * @param name The class name to validate
 * @throws {DatabaseDecoratorException} If the class name doesn't end with 'Database'
 */
const ensureIsDatabase = (name: string): void => {
  if (!name?.endsWith('Database')) {
    throw new DatabaseDecoratorException(
      `Database decorator can only be used on database classes. ${name} must end with Database keyword.`,
    );
  }
};

/**
 * Validates that a repository class name ends with 'Repository'
 * @param name The class name to validate
 * @throws {RepositoryDecoratorException} If the class name doesn't end with 'Repository'
 */
const ensureIsRepository = (name: string): void => {
  if (!name?.endsWith('Repository')) {
    throw new RepositoryDecoratorException(
      `Repository decorator can only be used on repository classes. ${name} must end with Repository keyword.`,
    );
  }
};
