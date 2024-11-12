import { Collection } from '@/collection/Collection.ts';
import { ICollection } from '@/collection/types.ts';
import { resolveDependencies } from '@/container/resolve.ts';
import { ContainerScopeType } from '@/container/types.ts';

const store = new Collection<
  ContainerScopeType,
  ICollection<string, unknown>
>();

export class Container {
  public async get<T = unknown>(
    key: string,
    scope?: ContainerScopeType,
  ): Promise<T | null> {
    if (scope) {
      const Value = store.get(scope)?.get(key) ?? null;
      if (!Value) return null;
      const dependencies = await resolveDependencies(key, scope);

      return new (Value as any)(...dependencies);
    }

    for (const [, container] of store) {
      const Value = container.get(key);
      if (Value) {
        const dependencies = await resolveDependencies(key, scope);

        return new (Value as any)(...dependencies);
      }
    }

    return null;
  }
}

export const container = new Container();
