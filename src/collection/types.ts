export interface IReadonlyCollection<
  K extends string | number = string,
  V = unknown,
> {
  get: <T extends V>(key: K) => T | undefined;
  has: (key: K) => boolean;
  isEmpty: () => boolean;
  count: () => number;
  keys: () => IterableIterator<K>;
  values: () => IterableIterator<V>;
  entries: () => IterableIterator<[K, V]>;
  [Symbol.iterator](): IterableIterator<[K, V]>;
}

export interface IReadonlyArrayCollection<V = unknown> {
  has: (value: V) => boolean;
  isEmpty: () => boolean;
  count: () => number;
  values: () => IterableIterator<V>;
  [Symbol.iterator](): IterableIterator<V>;
}

export interface ICollection<K extends string | number = string, V = unknown>
  extends IReadonlyCollection<K, V> {
  add: (key: K, value: V) => void;
  delete: (key: K) => void;
  clear: () => void;
}

export interface IArrayCollection<V = unknown>
  extends IReadonlyArrayCollection<V> {
  add: (value: V) => void;
  delete: (value: V) => void;
  clear: () => void;
}
