import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { ArrayCollection } from "@/collection/mod.ts";

describe("ArrayCollection", () => {
  let collection: ArrayCollection<string>;

  beforeEach(() => {
    collection = new ArrayCollection<string>();
  });

  describe("add", () => {
    it("should add a value to the collection", () => {
      const value = "test";
      collection.add(value);

      expect(collection.has(value)).toBe(true);
      expect(collection.count()).toBe(1);
    });

    it("should return the collection instance for chaining", () => {
      const result = collection.add("test");

      expect(result).toBe(collection);
    });
  });

  describe("delete", () => {
    it("should remove a value from the collection", () => {
      const value = "test";
      collection.add(value);
      collection.delete(value);

      expect(collection.has(value)).toBe(false);
      expect(collection.count()).toBe(0);
    });

    it("should return the collection instance for chaining", () => {
      const result = collection.delete("test");

      expect(result).toBe(collection);
    });

    it("should not throw error when deleting non-existent value", () => {
      expect(() => collection.delete("non-existent")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should remove all values from the collection", () => {
      collection.add("test1");
      collection.add("test2");
      collection.clear();

      expect(collection.count()).toBe(0);
    });

    it("should return the collection instance for chaining", () => {
      const result = collection.clear();

      expect(result).toBe(collection);
    });
  });

  describe("method chaining", () => {
    it("should support method chaining", () => {
      collection
        .add("test1")
        .add("test2")
        .delete("test1")
        .add("test3")
        .clear();

      expect(collection.count()).toBe(0);
    });
  });

  describe("type support", () => {
    it("should work with different types", () => {
      const numberCollection = new ArrayCollection<number>();
      numberCollection.add(1);
      expect(numberCollection.has(1)).toBe(true);

      const objectCollection = new ArrayCollection<object>();
      const obj = { test: true };
      objectCollection.add(obj);
      expect(objectCollection.has(obj)).toBe(true);
    });
  });
});
