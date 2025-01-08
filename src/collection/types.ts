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
  find: (fn: (key: K, value: V) => boolean) => { key: K; value: V } | null;
  filter: (fn: (key: K, value: V) => boolean) => { key: K; value: V }[];
  [Symbol.iterator](): IterableIterator<[K, V]>;
  toJson: () => Record<K, V>;
}

export interface IReadonlyArrayCollection<V = unknown> {
  has: (value: V) => boolean;
  isEmpty: () => boolean;
  count: () => number;
  values: () => IterableIterator<V>;
  find: (fn: (value: V) => boolean) => V | null;
  filter: (fn: (value: V) => boolean) => V[];
  [Symbol.iterator](): IterableIterator<V>;
  toJson: () => V[];
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
