import type { IReadonlyCollection } from './types.ts';

export class ReadonlyCollection<K extends string | number = string, V = unknown>
  implements IReadonlyCollection<K, V>
{
  protected data: Map<K, V>;

  constructor(data?: Map<K, V> | readonly (readonly [K, V])[]) {
    if (data) {
      this.data = data instanceof Map ? data : new Map<K, V>(data);
    } else {
      this.data = new Map<K, V>();
    }
  }

  public get<T = V>(key: K): T | undefined {
    return (this.data.get(key) as T) ?? undefined;
  }

  public has(key: K): boolean {
    return this.data.has(key);
  }

  public isEmpty(): boolean {
    return 0 === this.data.size;
  }

  public count(): number {
    return this.data.size;
  }

  public keys(): IterableIterator<K> {
    return this.data.keys();
  }

  public values(): IterableIterator<V> {
    return this.data.values();
  }

  public entries(): IterableIterator<[K, V]> {
    return this.data.entries();
  }

  public find(fn: (key: K, value: V) => boolean): { key: K; value: V } | null {
    for (const [key, value] of this.entries()) {
      if (fn(key, value)) {
        return { key, value };
      }
    }
    return null;
  }

  public filter(fn: (key: K, value: V) => boolean): { key: K; value: V }[] {
    const results: { key: K; value: V }[] = [];
    for (const [key, value] of this.entries()) {
      if (fn(key, value)) {
        results.push({ key, value });
      }
    }

    return results;
  }

  public toJson(): Record<K, V> {
    const data: Record<string | number, unknown> = {};
    for (const [key, value] of this) {
      data[key] = value;
    }
    return data as Record<K, V>;
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.data[Symbol.iterator]();
  }
}
