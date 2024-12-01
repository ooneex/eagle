// deno-lint-ignore-file no-unused-vars
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { container } from '../container/mod.ts';
import { storage, StorageDecoratorException } from './mod.ts';

describe('storage decorator', () => {
  it('should register valid storage class in container', () => {
    @storage()
    class TestStorage {
      get() {}
      put() {}
      delete() {}
    }

    const registered = container.getStore('storage')?.has('TestStorage');
    expect(registered).toBe(true);
    expect(container.get(TestStorage.name)).toBeInstanceOf(TestStorage);
  });

  it('should throw exception when class name does not end with Storage', () => {
    expect(() => {
      @storage()
      // @ts-ignore: trust me
      class InvalidName {
        get() {}
        put() {}
        delete() {}
      }
    }).toThrow(StorageDecoratorException);
  });

  it('should throw exception when class does not implement required methods', () => {
    expect(() => {
      @storage()
      // @ts-ignore: trust me
      class InvalidStorage {
        // Missing required methods
      }
    }).toThrow(StorageDecoratorException);
  });
});
