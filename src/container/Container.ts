import { Collection } from '../collection/Collection.ts';
import { ICollection } from '../collection/types.ts';
import { ContainerException } from './ContainerException.ts';
import { resolveDependencies } from './resolve.ts';
import { ContainerScopeType } from './types.ts';

export class Container {
  private store = new Collection<
    ContainerScopeType,
    ICollection<string, {
      value: unknown;
      singleton?: boolean;
      instance?: boolean;
    }>
  >();

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

      const dependencies = resolveDependencies(key, scope);
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

        const dependencies = resolveDependencies(key, scope);
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

    if (this.store.get(scope)!.has(key)) {
      throw new ContainerException(
        `Key '${key}' already exists in scope '${scope}'`,
      );
    }

    this.store.get(scope)!.add(key, { value, singleton, instance });

    return this;
  }
}

export const container = new Container();
