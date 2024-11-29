import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { database, repository, vector } from './decorators.ts';
import {
  DatabaseDecoratorException,
  RepositoryDecoratorException,
  VectorDatabaseDecoratorException,
} from './mod.ts';

describe('Database Decorators', () => {
  describe('database decorator', () => {
    it('should register a valid database class', () => {
      @database()
      class TestDatabase {}

      const instance = new TestDatabase();
      expect(instance instanceof TestDatabase).toBe(true);
    });

    it('should throw DatabaseDecoratorException for invalid class name', () => {
      expect(() => {
        @database()
        // @ts-ignore: trust me
        // deno-lint-ignore no-unused-vars
        class InvalidClass {}
      }).toThrow(
        DatabaseDecoratorException,
      );
    });
  });

  describe('vector decorator', () => {
    it('should register a valid vector database class', () => {
      @vector()
      class TestVectorDatabase {}

      const instance = new TestVectorDatabase();
      expect(instance instanceof TestVectorDatabase).toBe(true);
    });

    it('should throw VectorDatabaseDecoratorException for invalid class name', () => {
      expect(() => {
        @vector()
        // @ts-ignore: trust me
        // deno-lint-ignore no-unused-vars
        class InvalidClass {}
      }).toThrow(
        VectorDatabaseDecoratorException,
      );
    });
  });

  describe('repository decorator', () => {
    it('should register a valid repository class', () => {
      @repository()
      class TestRepository {}

      const instance = new TestRepository();
      expect(instance instanceof TestRepository).toBe(true);
    });

    it('should throw RepositoryDecoratorException for invalid class name', () => {
      expect(() => {
        @repository()
        // @ts-ignore: trust me
        // deno-lint-ignore no-unused-vars
        class InvalidClass {}
      }).toThrow(
        RepositoryDecoratorException,
      );
    });
  });
});
