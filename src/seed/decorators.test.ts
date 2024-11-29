// deno-lint-ignore-file no-unused-vars
import { container } from '@/container/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { seed, SeedContainer, SeedDecoratorException } from './mod.ts';

describe('seed decorator', () => {
  it('should register valid seed class', () => {
    @seed()
    // @ts-ignore: This is a test
    class TestSeed {
      execute() {
        return Promise.resolve();
      }

      getOrder() {
        return 1;
      }
    }

    expect(SeedContainer.has('TestSeed')).toBe(true);
    expect(container.getStore('seed')?.has('TestSeed')).toBe(true);
  });

  it('should throw error when class name does not end with Seed', () => {
    expect(() => {
      @seed()
      // @ts-ignore: This is a test
      class InvalidClass {
        execute() {
          return Promise.resolve();
        }

        getOrder() {
          return 1;
        }
      }
    }).toThrow(SeedDecoratorException);
  });

  it('should throw error when class does not implement required methods', () => {
    expect(() => {
      @seed()
      // @ts-ignore: This is a test
      class InvalidSeed {
        // Missing execute and getOrder methods
      }
    }).toThrow(SeedDecoratorException);
  });
});
