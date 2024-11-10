import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { ReadonlyArrayCollection } from "@/collection/mod.ts";

describe("ReadonlyArrayCollection", () => {
  it("should create empty collection", () => {
    const collection = new ReadonlyArrayCollection();
    expect(collection.isEmpty()).toBe(true);
    expect(collection.count()).toBe(0);
  });

  it("should create collection from array", () => {
    const array = [1, 2, 3];
    const collection = new ReadonlyArrayCollection(array);
    expect(collection.count()).toBe(3);
    expect(collection.has(1)).toBe(true);
    expect(collection.has(2)).toBe(true);
    expect(collection.has(3)).toBe(true);
    expect(collection.has(4)).toBe(false);
  });

  it("should create collection from Set", () => {
    const set = new Set([1, 2, 3]);
    const collection = new ReadonlyArrayCollection(set);
    expect(collection.count()).toBe(3);
    expect(collection.has(1)).toBe(true);
    expect(collection.has(2)).toBe(true);
    expect(collection.has(3)).toBe(true);
    expect(collection.has(4)).toBe(false);
  });

  it("should iterate over values", () => {
    const array = [1, 2, 3];
    const collection = new ReadonlyArrayCollection(array);
    const values = [...collection.values()];
    expect(values).toEqual([1, 2, 3]);
  });

  it("should support for...of iteration", () => {
    const array = [1, 2, 3];
    const collection = new ReadonlyArrayCollection(array);
    const values: number[] = [];
    for (const value of collection) {
      values.push(value);
    }
    expect(values).toEqual([1, 2, 3]);
  });

  it("should handle duplicate values in input array", () => {
    const array = [1, 1, 2, 2, 3, 3];
    const collection = new ReadonlyArrayCollection(array);
    expect(collection.count()).toBe(3);
    const values = [...collection.values()];
    expect(values).toEqual([1, 2, 3]);
  });

  it("should handle empty input array", () => {
    const array: number[] = [];
    const collection = new ReadonlyArrayCollection(array);
    expect(collection.isEmpty()).toBe(true);
    expect(collection.count()).toBe(0);
    expect([...collection.values()]).toEqual([]);
  });
});
