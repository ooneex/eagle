// deno-lint-ignore-file no-unused-vars
import { container } from '@/container/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { fixture, FixtureContainer, FixtureDecoratorException } from './mod.ts';

describe('fixture decorator', () => {
  it('should register valid fixture class', () => {
    @fixture()
    // @ts-ignore: This is a test
    class TestFixture {
      execute() {
        return Promise.resolve();
      }

      getOrder() {
        return 1;
      }
    }

    expect(FixtureContainer.has('TestFixture')).toBe(true);
    expect(container.getStore('fixture')?.has('TestFixture')).toBe(true);
  });

  it('should throw error when class name does not end with Fixture', () => {
    expect(() => {
      @fixture()
      // @ts-ignore: This is a test
      class InvalidClass {
        execute() {
          return Promise.resolve();
        }

        getOrder() {
          return 1;
        }
      }
    }).toThrow(FixtureDecoratorException);
  });

  it('should throw error when class does not implement required methods', () => {
    expect(() => {
      @fixture()
      // @ts-ignore: This is a test
      class InvalidFixture {
        // Missing execute and getOrder methods
      }
    }).toThrow(FixtureDecoratorException);
  });
});
