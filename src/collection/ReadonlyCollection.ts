import type { IReadonlyCollection } from './types.ts';

/**
 * A read-only collection class that wraps a Map with convenient access methods.
 * @template K The key type, must be string or number. Defaults to string.
 * @template V The value type. Defaults to unknown.
 */
export class ReadonlyCollection<K extends string | number = string, V = unknown>
  implements IReadonlyCollection<K, V>
{
  /** The underlying Map data structure */
  protected data: Map<K, V>;

  /**
   * Creates a new ReadonlyCollection
   * @param data Optional initial data as either a Map or array of key-value tuples
   */
  constructor(data?: Map<K, V> | readonly (readonly [K, V])[]) {
    if (data) {
      this.data = data instanceof Map ? data : new Map<K, V>(data);
    } else {
      this.data = new Map<K, V>();
    }
  }

  /**
   * Gets a value by key
   * @param key The key to look up
   * @returns The value if found, undefined otherwise
   */
  public get<T = V>(key: K): T | undefined {
    return (this.data.get(key) as T) ?? undefined;
  }

  /**
   * Checks if a key exists in the collection
   * @param key The key to check
   * @returns True if key exists, false otherwise
   */
  public has(key: K): boolean {
    return this.data.has(key);
  }

  /**
   * Checks if the collection is empty
   * @returns True if collection has no elements, false otherwise
   */
  public isEmpty(): boolean {
    return 0 === this.data.size;
  }

  /**
   * Gets the number of elements in the collection
   * @returns The element count
   */
  public count(): number {
    return this.data.size;
  }

  /**
   * Gets an iterator over the collection's keys
   * @returns Iterator of keys
   */
  public keys(): IterableIterator<K> {
    return this.data.keys();
  }

  /**
   * Gets an iterator over the collection's values
   * @returns Iterator of values
   */
  public values(): IterableIterator<V> {
    return this.data.values();
  }

  /**
   * Gets an iterator over the collection's entries
   * @returns Iterator of key-value pairs
   */
  public entries(): IterableIterator<[K, V]> {
    return this.data.entries();
  }

  /**
   * Finds first entry matching a predicate
   * @param fn The predicate function
   * @returns Matching entry or null if not found
   */
  public find(fn: (key: K, value: V) => boolean): { key: K; value: V } | null {
    for (const [key, value] of this.entries()) {
      if (fn(key, value)) {
        return { key, value };
      }
    }
    return null;
  }

  /**
   * Filters entries by a predicate
   * @param fn The predicate function
   * @returns Array of matching entries
   */
  public filter(fn: (key: K, value: V) => boolean): { key: K; value: V }[] {
    const results: { key: K; value: V }[] = [];
    for (const [key, value] of this.entries()) {
      if (fn(key, value)) {
        results.push({ key, value });
      }
    }

    return results;
  }

  /**
   * Converts the collection to a plain object
   * @returns Record with the collection's entries
   */
  public toJson(): Record<K, V> {
    const data: Record<string | number, unknown> = {};
    for (const [key, value] of this) {
      data[key] = value;
    }
    return data as Record<K, V>;
  }

  /**
   * Makes the collection iterable
   * @returns Iterator over the collection's entries
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.data[Symbol.iterator]();
  }
}
