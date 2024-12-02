import { Collection } from '../collection/Collection.ts';
import { ICollection } from '../collection/types.ts';
import { ContainerException } from './ContainerException.ts';
import { resolveDependencies } from './resolve.ts';
import { ContainerScopeType } from './types.ts';

/**
 * Container class that manages dependency injection and service location
 */
export class Container {
  /**
   * Internal storage for container entries
   */
  private store = new Collection<
    ContainerScopeType,
    ICollection<string, {
      value: any;
      singleton?: boolean;
      instance?: boolean;
    }>
  >();

  /**
   * Retrieves an entry from the container
   * @param key - The key to lookup
   * @param scope - Optional scope to search in
   * @returns The resolved value or null if not found
   */
  public get<T = unknown>(
    key: string,
    scope?: ContainerScopeType,
  ): T | null {
    if (scope) {
      const Value = this.store.get(scope)?.get(key) ?? null;
      if (!Value) return null;

      if (Value.singleton && Value.instance) {
        return Value.value as T;
      }

      const dependencies = resolveDependencies(key);
      const instance = new (Value.value as any)(...dependencies);

      if (Value.singleton) {
        Value.value = instance;
        Value.instance = true;
        this.store.get(scope)?.add(key, Value);
      }

      return instance;
    }

    for (const [, container] of this.store) {
      const Value = container.get(key);

      if (Value) {
        if (Value.singleton && Value.instance) {
          return Value.value as T;
        }

        const dependencies = resolveDependencies(key);
        const instance = new (Value.value as any)(...dependencies);

        if (Value.singleton) {
          Value.value = instance;
          Value.instance = true;
          container.add(key, Value);
        }

        return instance;
      }
    }

    return null;
  }

  /**
   * Adds an entry to the container
   * @param key - The key to store the value under
   * @param value - The value to store
   * @param options - Configuration options
   * @returns The container instance for chaining
   * @throws ContainerException if key already exists in scope
   */
  public add<T = unknown>(
    key: string,
    value: T,
    options: {
      scope?: ContainerScopeType;
      singleton?: boolean;
      instance?: boolean;
    },
  ): this {
    const { scope = 'default', singleton = false, instance = false } = options;

    if (!this.store.has(scope)) {
      this.store.add(scope, new Collection());
    }

    if (this.store.get(scope)?.has(key)) {
      throw new ContainerException(
        `Key '${key}' already exists in scope '${scope}'`,
      );
    }

    this.store.get(scope)?.add(key, { value, singleton, instance });

    return this;
  }

  /**
   * Gets the store for a specific scope
   * @param scope - The scope to get the store for
   * @returns The store for the given scope
   */
  public getStore(scope: ContainerScopeType) {
    return this.store.get(scope);
  }
}

/**
 * Default container instance
 */
export const container = new Container();
