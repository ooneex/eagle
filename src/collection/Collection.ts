import { ReadonlyCollection } from './ReadonlyCollection';
import type { ICollection } from './types';

export class Collection<K extends string | number = string, V = unknown>
  extends ReadonlyCollection<K, V>
  implements ICollection<K, V>
{
  public add(key: string | number, value: V): void {
    this.data.set(key as K, value);
  }

  public delete(key: K): void {
    this.data.delete(key);
  }

  public clear(): void {
    this.data.clear();
  }
}
