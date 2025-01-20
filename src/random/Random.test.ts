import { describe, expect, it } from 'bun:test';
import { Random } from './Random';

describe('Random', () => {
  describe('uuid()', () => {
    it('should generate a valid UUID', () => {
      const uuid = Random.uuid();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('nanoid()', () => {
    it('should generate a string with default length of 10', () => {
      const id = Random.nanoid();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{10}$/);
    });

    it('should generate a string with specified length', () => {
      const id = Random.nanoid(15);
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{15}$/);
    });
  });

  describe('nanoidFactory()', () => {
    it('should return a function that generates ids with default length', () => {
      const generator = Random.nanoidFactory();
      const id = generator();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{10}$/);
    });

    it('should return a function that generates ids with specified length', () => {
      const generator = Random.nanoidFactory(15);
      const id = generator();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{15}$/);

      // Generator should respect override size
      const customId = generator(20);
      expect(customId).toMatch(/^[0-9a-f]{20}$/);
    });
  });
});
