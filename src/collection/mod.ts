/**
 * Collection module providing array-based collection implementations.
 *
 * This module exports various collection classes for managing arrays of items
 * with type safety and common collection operations.
 *
 * @module collection
 *
 * @example
 * ```ts
 * import { Collection } from './collection/mod.ts';
 *
 * // Create a typed collection
 * const numbers = new Collection<number>();
 *
 * // Add items
 * numbers.add(1);
 * numbers.addMany([2, 3, 4]);
 *
 * // Get items
 * const first = numbers.first(); // 1
 * const items = numbers.toArray(); // [1, 2, 3, 4]
 * ```
 *
 * @example
 * ```ts
 * // Using readonly collection
 * import { ReadonlyCollection } from './collection/mod.ts';
 *
 * const readonly = new ReadonlyCollection([1, 2, 3]);
 *
 * // Read operations
 * readonly.has(2); // true
 * readonly.count(); // 3
 * readonly.find(n => n > 2); // 3
 *
 * // Mutations not allowed
 * readonly.add(4); // Error: Collection is readonly
 * ```
 *
 * @example
 * ```ts
 * // Array collection with filtering and mapping
 * import { ArrayCollection } from './collection/mod.ts';
 *
 * const users = new ArrayCollection([
 *   { id: 1, name: 'John' },
 *   { id: 2, name: 'Jane' }
 * ]);
 *
 * const names = users
 *   .filter(u => u.id > 1)
 *   .map(u => u.name)
 *   .toArray(); // ['Jane']
 * ```
 */

export { ArrayCollection } from './ArrayCollection.ts';
export { Collection } from './Collection.ts';
export { ReadonlyArrayCollection } from './ReadonlyArrayCollection.ts';
export { ReadonlyCollection } from './ReadonlyCollection.ts';
export * from './types.ts';
