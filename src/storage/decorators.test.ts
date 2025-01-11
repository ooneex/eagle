import { describe, expect, it } from 'bun:test';
import { StorageDecoratorException, storage } from '@/storage';

describe('storage decorator', () => {
  it('should throw error if class name does not end with Storage', () => {
    expect(() => {
      @storage()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {}
    }).toThrow(StorageDecoratorException);

    expect(() => {
      @storage()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {}
    }).toThrow(
      'Storage decorator can only be used on storage classes. InvalidClass must end with Storage keyword and implement IStorage interface.',
    );
  });

  it('should not throw error if class name ends with Storage and implements IStorage', () => {
    expect(() => {
      @storage()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class ValidStorage {
        getOptions() {
          return {};
        }
        exists() {
          return Promise.resolve(true);
        }
        delete() {
          return Promise.resolve();
        }
        putFile() {
          return Promise.resolve(0);
        }
        put() {
          return Promise.resolve(0);
        }
        getAsJson() {
          return Promise.resolve({});
        }
        getAsArrayBuffer() {
          return Promise.resolve(new ArrayBuffer(0));
        }
        getAsStream() {
          return new ReadableStream();
        }
      }
    }).not.toThrow();
  });

  it('should allow configuring scope', () => {
    expect(() => {
      @storage({ scope: 'transient' })
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class TransientScopedStorage {
        getOptions() {
          return {};
        }
        exists() {
          return Promise.resolve(true);
        }
        delete() {
          return Promise.resolve();
        }
        putFile() {
          return Promise.resolve(0);
        }
        put() {
          return Promise.resolve(0);
        }
        getAsJson() {
          return Promise.resolve({});
        }
        getAsArrayBuffer() {
          return Promise.resolve(new ArrayBuffer(0));
        }
        getAsStream() {
          return new ReadableStream();
        }
      }
    }).not.toThrow();

    expect(() => {
      @storage({ scope: 'singleton' })
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class SingletonScopedStorage {
        getOptions() {
          return {};
        }
        exists() {
          return Promise.resolve(true);
        }
        delete() {
          return Promise.resolve();
        }
        putFile() {
          return Promise.resolve(0);
        }
        put() {
          return Promise.resolve(0);
        }
        getAsJson() {
          return Promise.resolve({});
        }
        getAsArrayBuffer() {
          return Promise.resolve(new ArrayBuffer(0));
        }
        getAsStream() {
          return new ReadableStream();
        }
      }
    }).not.toThrow();
  });
});
