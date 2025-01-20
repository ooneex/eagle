import type { IReadonlyArrayCollection } from './types';

export class ReadonlyArrayCollection<V = unknown>
  implements IReadonlyArrayCollection<V>
{
  protected data: Set<V>;

  constructor(data?: Set<V> | V[]) {
    this.data = data instanceof Set ? data : new Set<V>(data ?? []);
  }

  public has(value: V): boolean {
    return this.data.has(value);
  }

  public isEmpty(): boolean {
    return 0 === this.data.size;
  }

  public count(): number {
    return this.data.size;
  }

  public values(): IterableIterator<V> {
    return this.data.values();
  }

  public find(fn: (value: V) => boolean): V | null {
    for (const value of this.data) {
      if (fn(value)) return value;
    }

    return null;
  }

  public filter(fn: (value: V) => boolean): V[] {
    return Array.from(this.data).filter(fn);
  }

  public toJson(): V[] {
    return Array.from(this.data);
  }

  [Symbol.iterator](): IterableIterator<V> {
    return this.data[Symbol.iterator]();
  }
}
