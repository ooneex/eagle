import { describe, expect, it } from 'bun:test';
import { ReadonlyArrayCollection } from '@/collection';

describe('ReadonlyArrayCollection', () => {
  it('should create empty collection', () => {
    const collection = new ReadonlyArrayCollection();
    expect(collection.isEmpty()).toBe(true);
    expect(collection.count()).toBe(0);
  });

  it('should create collection from array', () => {
    const array = [1, 2, 3];
    const collection = new ReadonlyArrayCollection(array);
    expect(collection.count()).toBe(3);
    expect(collection.has(1)).toBe(true);
    expect(collection.has(2)).toBe(true);
    expect(collection.has(3)).toBe(true);
    expect(collection.has(4)).toBe(false);
  });

  it('should create collection from Set', () => {
    const set = new Set([1, 2, 3]);
    const collection = new ReadonlyArrayCollection(set);
    expect(collection.count()).toBe(3);
    expect(collection.has(1)).toBe(true);
    expect(collection.has(2)).toBe(true);
    expect(collection.has(3)).toBe(true);
    expect(collection.has(4)).toBe(false);
  });

  it('should iterate over values', () => {
    const array = [1, 2, 3];
    const collection = new ReadonlyArrayCollection(array);
    const values = [...collection.values()];
    expect(values).toEqual([1, 2, 3]);
  });

  it('should support for...of iteration', () => {
    const array = [1, 2, 3];
    const collection = new ReadonlyArrayCollection(array);
    const values: number[] = [];
    for (const value of collection) {
      values.push(value);
    }
    expect(values).toEqual([1, 2, 3]);
  });

  it('should handle duplicate values in input array', () => {
    const array = [1, 1, 2, 2, 3, 3];
    const collection = new ReadonlyArrayCollection(array);
    expect(collection.count()).toBe(3);
    const values = [...collection.values()];
    expect(values).toEqual([1, 2, 3]);
  });

  it('should handle empty input array', () => {
    const array: number[] = [];
    const collection = new ReadonlyArrayCollection(array);
    expect(collection.isEmpty()).toBe(true);
    expect(collection.count()).toBe(0);
    expect([...collection.values()]).toEqual([]);
  });

  it('should find first matching value', () => {
    const collection = new ReadonlyArrayCollection([1, 2, 3, 4]);

    const result = collection.find((value) => value > 2);
    expect(result).toBe(3);

    const noResult = collection.find((value) => value > 10);
    expect(noResult).toBeNull();
  });

  it('should filter values', () => {
    const collection = new ReadonlyArrayCollection([1, 2, 3, 4]);

    const results = collection.filter((value) => value % 2 === 0);
    expect(results).toEqual([2, 4]);

    const noResults = collection.filter((value) => value > 10);
    expect(noResults).toEqual([]);
  });

  it('should check if value exists', () => {
    const collection = new ReadonlyArrayCollection([1, 2, 3]);
    expect(collection.has(2)).toBe(true);
    expect(collection.has(4)).toBe(false);
  });

  it('should check if collection is empty', () => {
    const emptyCollection = new ReadonlyArrayCollection();
    expect(emptyCollection.isEmpty()).toBe(true);

    const nonEmptyCollection = new ReadonlyArrayCollection([1]);
    expect(nonEmptyCollection.isEmpty()).toBe(false);
  });

  it('should return collection size', () => {
    const collection = new ReadonlyArrayCollection([1, 2, 3]);
    expect(collection.count()).toBe(3);
  });

  it('should iterate over values', () => {
    const collection = new ReadonlyArrayCollection([1, 2, 3]);
    const values = Array.from(collection.values());
    expect(values).toEqual([1, 2, 3]);
  });

  it('should convert to JSON', () => {
    const collection = new ReadonlyArrayCollection([1, 2, 3]);
    expect(collection.toJson()).toEqual([1, 2, 3]);
  });
});
