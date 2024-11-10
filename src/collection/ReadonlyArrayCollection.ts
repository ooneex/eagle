import { IReadonlyArrayCollection } from "@/collection/types.ts";

export class ReadonlyArrayCollection<V = unknown>
  implements IReadonlyArrayCollection<V> {
  protected data: Set<V>;

  constructor(data?: Set<V> | V[]) {
    if (!data) data = [];

    this.data = data instanceof Set ? data : new Set<V>(data);
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

  [Symbol.iterator](): IterableIterator<V> {
    return this.data[Symbol.iterator]();
  }
}
