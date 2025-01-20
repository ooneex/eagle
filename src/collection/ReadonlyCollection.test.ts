import { describe, expect, it } from 'bun:test';
import { ReadonlyCollection } from '.';

describe('ReadonlyCollection', () => {
  it('should create empty collection', () => {
    const collection = new ReadonlyCollection<string, number>();
    expect(collection.isEmpty()).toBe(true);
    expect(collection.count()).toBe(0);
  });

  it('should create collection from Map', () => {
    const map = new Map<string, number>([
      ['a', 1],
      ['b', 2],
    ]);
    const collection = new ReadonlyCollection(map);
    expect(collection.count()).toBe(2);
    expect(collection.get('a') as number).toBe(1);
    expect(collection.get('b') as number).toBe(2);
  });

  it('should create collection from array of tuples', () => {
    const arr: [string, number][] = [
      ['a', 1],
      ['b', 2],
    ];
    const collection = new ReadonlyCollection(arr);
    expect(collection.count()).toBe(2);
    expect(collection.get('a') as number).toBe(1);
    expect(collection.get('b') as number).toBe(2);
  });

  it('should check if key exists', () => {
    const collection = new ReadonlyCollection([['key', 'value']]);
    expect(collection.has('key')).toBe(true);
    //@ts-ignore: trust me
    expect(collection.has('nonexistent')).toBe(false);
  });

  it('should return undefined for nonexistent key', () => {
    const collection = new ReadonlyCollection<string, string>();
    expect(collection.get('nonexistent')).toBeUndefined();
  });

  it('should iterate over keys', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
    ]);
    const keys = Array.from(collection.keys());
    expect(keys).toEqual(['a', 'b']);
  });

  it('should iterate over values', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
    ]);
    const values = Array.from(collection.values());
    expect(values).toEqual([1, 2]);
  });

  it('should iterate over entries', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
    ]);
    const entries = Array.from(collection.entries());
    expect(entries).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });

  it('should be iterable', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
    ]);
    const entries = Array.from(collection);
    expect(entries).toEqual([
      ['a', 1],
      ['b', 2],
    ]);
  });

  it('should check if collection is empty', () => {
    const emptyCollection = new ReadonlyCollection();
    expect(emptyCollection.isEmpty()).toBe(true);

    const nonEmptyCollection = new ReadonlyCollection([['a', 1]]);
    expect(nonEmptyCollection.isEmpty()).toBe(false);
  });

  it('should return collection size', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    expect(collection.count()).toBe(3);
  });

  it('should find first matching entry', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    const result = collection.find((_key, value) => value > 2);
    expect(result).toEqual({ key: 'c', value: 3 });

    const noResult = collection.find((_key, value) => value > 10);
    expect(noResult).toBeNull();
  });

  it('should filter entries', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]);

    const results = collection.filter((_key, value) => value % 2 === 0);
    expect(results).toEqual([
      { key: 'b', value: 2 },
      { key: 'd', value: 4 },
    ]);

    const noResults = collection.filter((_key, value) => value > 10);
    expect(noResults).toEqual([]);
  });

  it('should convert to JSON', () => {
    const collection = new ReadonlyCollection([
      ['a', 1],
      ['b', 2],
    ]);
    expect(collection.toJson()).toEqual({ a: 1, b: 2 });
  });
});
