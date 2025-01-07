import { ReadonlyCollection } from './ReadonlyCollection.ts';
import type { ICollection } from './types.ts';

/**
 * A mutable collection class that extends ReadonlyCollection and implements ICollection interface.
 * Allows adding, deleting and clearing key-value pairs.
 * @template K The key type, must be either string or number. Defaults to string.
 * @template V The value type. Defaults to unknown.
 */
export class Collection<K extends string | number = string, V = unknown>
  extends ReadonlyCollection<K, V>
  implements ICollection<K, V> {
  /**
   * Adds a key-value pair to the collection
   * @param key The key to add
   * @param value The value to associate with the key
   */
  public add(key: string | number, value: V): void {
    this.data.set(key as K, value);
  }

  /**
   * Deletes a key-value pair from the collection
   * @param key The key to delete
   */
  public delete(key: K): void {
    this.data.delete(key);
  }

  /**
   * Removes all key-value pairs from the collection
   */
  public clear(): void {
    this.data.clear();
  }
}
