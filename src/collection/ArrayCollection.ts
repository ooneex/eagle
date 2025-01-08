/**
 * A mutable collection class for managing arrays of values.
 * Extends ReadonlyArrayCollection to provide write operations.
 * @template V The type of values stored in the collection. Defaults to unknown.
 */
import { ReadonlyArrayCollection } from './ReadonlyArrayCollection.ts';
import type { IArrayCollection } from './types.ts';

export class ArrayCollection<V = unknown>
  extends ReadonlyArrayCollection<V>
  implements IArrayCollection<V>
{
  /**
   * Adds a value to the collection.
   * @param value The value to add
   * @returns The collection instance for chaining
   */
  public add(value: V): this {
    this.data.add(value);

    return this;
  }

  /**
   * Removes a value from the collection.
   * @param value The value to delete
   * @returns The collection instance for chaining
   */
  public delete(value: V): this {
    this.data.delete(value);

    return this;
  }

  /**
   * Removes all values from the collection.
   * @returns The collection instance for chaining
   */
  public clear(): this {
    this.data.clear();

    return this;
  }
}
