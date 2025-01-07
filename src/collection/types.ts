/**
 * Represents a read-only collection with key-value pairs
 * @template K The key type (string or number)
 * @template V The value type
 */
export interface IReadonlyCollection<
  K extends string | number = string,
  V = unknown,
> {
  /** Gets the value associated with the specified key */
  get: <T extends V>(key: K) => T | undefined;
  /** Checks if the collection contains the specified key */
  has: (key: K) => boolean;
  /** Checks if the collection is empty */
  isEmpty: () => boolean;
  /** Gets the number of elements in the collection */
  count: () => number;
  /** Returns an iterator over the keys in the collection */
  keys: () => IterableIterator<K>;
  /** Returns an iterator over the values in the collection */
  values: () => IterableIterator<V>;
  /** Returns an iterator over the key-value pairs in the collection */
  entries: () => IterableIterator<[K, V]>;
  /** Finds the first key-value pair that matches the provided predicate */
  find: (
    fn: (key: K, value: V) => boolean,
  ) => { key: K; value: V } | null;
  /** Returns all key-value pairs that match the provided predicate */
  filter: (
    fn: (key: K, value: V) => boolean,
  ) => { key: K; value: V }[];
  /** Makes the collection iterable */
  [Symbol.iterator](): IterableIterator<[K, V]>;
  /** Converts the collection to a plain object */
  toJson: () => Record<K, V>;
}

/**
 * Represents a read-only collection of values without keys
 * @template V The value type
 */
export interface IReadonlyArrayCollection<V = unknown> {
  /** Checks if the collection contains the specified value */
  has: (value: V) => boolean;
  /** Checks if the collection is empty */
  isEmpty: () => boolean;
  /** Gets the number of elements in the collection */
  count: () => number;
  /** Returns an iterator over the values in the collection */
  values: () => IterableIterator<V>;
  /** Finds the first value that matches the provided predicate */
  find: (fn: (value: V) => boolean) => V | null;
  /** Returns all values that match the provided predicate */
  filter: (fn: (value: V) => boolean) => V[];
  /** Makes the collection iterable */
  [Symbol.iterator](): IterableIterator<V>;
  /** Converts the collection to an array */
  toJson: () => V[];
}

/**
 * Represents a mutable collection with key-value pairs
 * @template K The key type (string or number)
 * @template V The value type
 */
export interface ICollection<K extends string | number = string, V = unknown>
  extends IReadonlyCollection<K, V> {
  /** Adds or updates a key-value pair */
  add: (key: K, value: V) => void;
  /** Removes the specified key and its associated value */
  delete: (key: K) => void;
  /** Removes all elements from the collection */
  clear: () => void;
}

/**
 * Represents a mutable collection of values without keys
 * @template V The value type
 */
export interface IArrayCollection<V = unknown>
  extends IReadonlyArrayCollection<V> {
  /** Adds a value to the collection */
  add: (value: V) => void;
  /** Removes the specified value */
  delete: (value: V) => void;
  /** Removes all elements from the collection */
  clear: () => void;
}
