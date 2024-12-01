// deno-lint-ignore-file no-unused-vars
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { container } from '../container/mod.ts';
import { middleware, MiddlewareDecoratorException } from './mod.ts';

describe('middleware decorator', () => {
  it('should register valid middleware class in container', () => {
    @middleware()
    class ValidMiddleware {
      execute() {}
      getScope() {
        return 'test';
      }
      getOrder() {
        return 1;
      }
    }

    const registered = container.getStore('middleware')?.has('ValidMiddleware');
    expect(registered).toBe(true);

    const instance = container.get('ValidMiddleware');
    expect(instance).toBeInstanceOf(ValidMiddleware);
  });

  it('should throw exception for invalid middleware class', () => {
    expect(() => {
      @middleware()
      // @ts-ignore: trust me
      class InvalidClass {
        execute() {}
      }
    }).toThrow(MiddlewareDecoratorException);
  });

  it('should throw exception for class without Middleware suffix', () => {
    expect(() => {
      @middleware()
      // @ts-ignore: trust me
      class ValidHandler {
        execute() {}
        getScope() {
          return 'test';
        }
        getOrder() {
          return 1;
        }
      }
    }).toThrow(MiddlewareDecoratorException);
  });
});
