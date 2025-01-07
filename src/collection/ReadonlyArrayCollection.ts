import type { IReadonlyArrayCollection } from './types.ts';

/**
 * A read-only collection class backed by a Set that implements IReadonlyArrayCollection.
 * Provides methods for querying and iterating over the collection without modifying it.
 */
export class ReadonlyArrayCollection<V = unknown>
  implements IReadonlyArrayCollection<V>
{
  /** The underlying Set containing the collection data */
  protected data: Set<V>;

  /**
   * Creates a new ReadonlyArrayCollection
   * @param data Optional initial data as a Set or Array
   */
  constructor(data?: Set<V> | V[]) {
    this.data = data instanceof Set ? data : new Set<V>(data ?? []);
  }

  /**
   * Checks if a value exists in the collection
   * @param value The value to check for
   * @returns True if the value exists, false otherwise
   */
  public has(value: V): boolean {
    return this.data.has(value);
  }

  /**
   * Checks if the collection is empty
   * @returns True if empty, false otherwise
   */
  public isEmpty(): boolean {
    return 0 === this.data.size;
  }

  /**
   * Gets the number of items in the collection
   * @returns The item count
   */
  public count(): number {
    return this.data.size;
  }

  /**
   * Gets an iterator of all values in the collection
   * @returns Iterator of collection values
   */
  public values(): IterableIterator<V> {
    return this.data.values();
  }

  /**
   * Finds the first item matching a predicate function
   * @param fn The predicate function
   * @returns Matching item or null if not found
   */
  public find(fn: (value: V) => boolean): V | null {
    for (const value of this.data) {
      if (fn(value)) return value;
    }

    return null;
  }

  /**
   * Filters the collection using a predicate function
   * @param fn The predicate function
   * @returns Array of matching items
   */
  public filter(fn: (value: V) => boolean): V[] {
    return Array.from(this.data).filter(fn);
  }

  /**
   * Converts the collection to a JSON array
   * @returns Array of collection values
   */
  public toJson(): V[] {
    return Array.from(this.data);
  }

  /**
   * Makes the collection iterable
   * @returns Iterator for the collection
   */
  [Symbol.iterator](): IterableIterator<V> {
    return this.data[Symbol.iterator]();
  }
}
