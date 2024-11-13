import { container } from '@/container/Container.ts';
import { Service, ServiceDecoratorException } from '@/service/mod.ts';
import { expect } from '@std/expect';
import { beforeEach, describe, it } from '@std/testing/bdd';

describe('Service Decorator', () => {
  beforeEach(() => {
    // Clear container before each test
    // container.clear();
  });

  it('should register a valid service class', () => {
    @Service()
    // @ts-ignore: This is a test
    class TestService {}
    const registeredService = container.get('TestService');
    expect(registeredService).toBeDefined();
    expect(registeredService).toBeInstanceOf(TestService);
  });

  it('should throw error when decorator is used on non-service class', () => {
    expect(() => {
      @Service()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class InvalidClass {}
    }).toThrow(ServiceDecoratorException);
  });

  it('should throw error when class name does not end with Service', () => {
    expect(() => {
      @Service()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class TestController {}
    }).toThrow(ServiceDecoratorException);
  });

  it('should register service as singleton', () => {
    @Service()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class SingletonService {}

    const instance1 = container.get('SingletonService');
    const instance2 = container.get('SingletonService');

    expect(instance1).toBe(instance2);
  });
});
