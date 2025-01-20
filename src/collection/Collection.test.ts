import { describe, expect, it } from 'bun:test';
import { Collection } from '.';

describe('Collection', () => {
  describe('add', () => {
    it('should add a string key-value pair to the collection', () => {
      const collection = new Collection<string, string>();
      collection.add('key1', 'value1');

      expect(collection.has('key1')).toBe(true);
      expect(collection.get('key1') as string).toBe('value1');
    });

    it('should add a number key-value pair to the collection', () => {
      const collection = new Collection<number, string>();
      collection.add(1, 'value1');

      expect(collection.has(1)).toBe(true);
      expect(collection.get(1) as string).toBe('value1');
    });

    it('should override existing value when adding with same key', () => {
      const collection = new Collection<string, string>();
      collection.add('key1', 'value1');
      collection.add('key1', 'value2');

      expect(collection.get('key1') as string).toBe('value2');
    });
  });

  describe('delete', () => {
    it('should remove an existing key-value pair', () => {
      const collection = new Collection<string, string>();
      collection.add('key1', 'value1');
      collection.delete('key1');

      expect(collection.has('key1')).toBe(false);
      expect(collection.get('key1')).toBeUndefined();
    });

    it('should not throw when deleting non-existent key', () => {
      const collection = new Collection<string, string>();

      expect(() => collection.delete('nonexistent')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should remove all key-value pairs from collection', () => {
      const collection = new Collection<string, string>();
      collection.add('key1', 'value1');
      collection.add('key2', 'value2');
      collection.clear();

      expect(collection.count()).toBe(0);
      expect(collection.has('key1')).toBe(false);
      expect(collection.has('key2')).toBe(false);
    });

    it('should work on empty collection', () => {
      const collection = new Collection<string, string>();

      expect(() => collection.clear()).not.toThrow();
      expect(collection.count()).toBe(0);
    });
  });

  describe('inherited methods', () => {
    it('should correctly use inherited get method', () => {
      const collection = new Collection<string, string>();
      collection.add('key1', 'value1');

      expect(collection.get('key1') as string).toBe('value1');
    });

    it('should correctly use inherited has method', () => {
      const collection = new Collection<string, string>();
      collection.add('key1', 'value1');

      expect(collection.has('key1')).toBe(true);
      expect(collection.has('nonexistent')).toBe(false);
    });

    it('should correctly use inherited size property', () => {
      const collection = new Collection<string, string>();
      expect(collection.count()).toBe(0);

      collection.add('key1', 'value1');
      expect(collection.count()).toBe(1);

      collection.add('key2', 'value2');
      expect(collection.count()).toBe(2);
    });
  });
});
