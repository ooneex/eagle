import { describe, expect, it } from 'bun:test';
import { container } from '../container';
import { DatabaseDecoratorException } from './DatabaseDecoratorException';
import { RepositoryDecoratorException } from './RepositoryDecoratorException';
import { database, repository } from './decorators';

describe('database decorator', () => {
  it('should register database class with singleton scope by default', () => {
    @database()
    class TestDatabase {
      public connect() {}
    }

    const instance1 = container.get<TestDatabase>(TestDatabase);
    const instance2 = container.get<TestDatabase>(TestDatabase);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should register database class with transient scope when specified', () => {
    @database({ scope: 'transient' })
    class TransientScopedDatabase {
      public connect() {}
    }

    const instance1 = container.get<TransientScopedDatabase>(
      TransientScopedDatabase,
    );
    const instance2 = container.get<TransientScopedDatabase>(
      TransientScopedDatabase,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    expect(() => {
      @database()
      // biome-ignore lint/correctness/noUnusedVariables: test purpose
      class InvalidClass {
        public connect() {}
      }
    }).toThrow(DatabaseDecoratorException);
  });

  it('should properly inject dependencies in database classes', () => {
    @database()
    class DependencyDatabase {
      public connect() {}
    }

    @database()
    class InjectedDatabase {
      constructor(public dependency: DependencyDatabase) {}
      public connect() {}
    }

    const instance = container.get<InjectedDatabase>(InjectedDatabase);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedDatabase);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyDatabase);
  });

  it('should register repository class with singleton scope by default', () => {
    @repository()
    class SingletonScopedRepository {
      public find() {}
    }

    const instance1 = container.get<SingletonScopedRepository>(
      SingletonScopedRepository,
    );
    const instance2 = container.get<SingletonScopedRepository>(
      SingletonScopedRepository,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should register repository class with transient scope when specified', () => {
    @repository({ scope: 'transient' })
    class TransientScopedRepository {
      public find() {}
    }

    const instance1 = container.get<TransientScopedRepository>(
      TransientScopedRepository,
    );
    const instance2 = container.get<TransientScopedRepository>(
      TransientScopedRepository,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    expect(() => {
      @repository()
      // biome-ignore lint/correctness/noUnusedVariables: test purpose
      class InvalidClass {
        public find() {}
      }
    }).toThrow(RepositoryDecoratorException);
  });

  it('should properly inject dependencies in repository classes', () => {
    @repository()
    class DependencyRepository {
      public find() {}
    }

    @repository()
    class InjectedRepository {
      constructor(public dependency: DependencyRepository) {}
      public find() {}
    }

    const instance = container.get<InjectedRepository>(InjectedRepository);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedRepository);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyRepository);
  });
});
