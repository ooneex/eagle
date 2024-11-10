import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { ReadonlyCollection } from "@/collection/ReadonlyCollection.ts";

describe("ReadonlyCollection", () => {
  it("should create empty collection", () => {
    const collection = new ReadonlyCollection<string, number>();
    expect(collection.isEmpty()).toBe(true);
    expect(collection.count()).toBe(0);
  });

  it("should create collection from Map", () => {
    const map = new Map<string, number>([
      ["a", 1],
      ["b", 2],
    ]);
    const collection = new ReadonlyCollection(map);
    expect(collection.count()).toBe(2);
    expect(collection.get("a")).toBe(1);
    expect(collection.get("b")).toBe(2);
  });

  it("should create collection from array of tuples", () => {
    const arr: [string, number][] = [
      ["a", 1],
      ["b", 2],
    ];
    const collection = new ReadonlyCollection(arr);
    expect(collection.count()).toBe(2);
    expect(collection.get("a")).toBe(1);
    expect(collection.get("b")).toBe(2);
  });

  it("should check if key exists", () => {
    const collection = new ReadonlyCollection([["key", "value"]]);
    expect(collection.has("key")).toBe(true);
    //@ts-ignore: trust me
    expect(collection.has("nonexistent")).toBe(false);
  });

  it("should return undefined for nonexistent key", () => {
    const collection = new ReadonlyCollection<string, string>();
    expect(collection.get("nonexistent")).toBeUndefined();
  });

  it("should iterate over keys", () => {
    const collection = new ReadonlyCollection([
      ["a", 1],
      ["b", 2],
    ]);
    const keys = Array.from(collection.keys());
    expect(keys).toEqual(["a", "b"]);
  });

  it("should iterate over values", () => {
    const collection = new ReadonlyCollection([
      ["a", 1],
      ["b", 2],
    ]);
    const values = Array.from(collection.values());
    expect(values).toEqual([1, 2]);
  });

  it("should iterate over entries", () => {
    const collection = new ReadonlyCollection([
      ["a", 1],
      ["b", 2],
    ]);
    const entries = Array.from(collection.entries());
    expect(entries).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("should be iterable", () => {
    const collection = new ReadonlyCollection([
      ["a", 1],
      ["b", 2],
    ]);
    const entries = Array.from(collection);
    expect(entries).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });
});
