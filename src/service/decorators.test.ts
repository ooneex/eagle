import { container } from '@/container/Container.ts';
import { service, ServiceDecoratorException } from '@/service/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('Service Decorator', () => {
  it('should register a valid service class', () => {
    @service()
    // @ts-ignore: This is a test
    class TestService {}
    const registeredService = container.get('TestService');
    expect(registeredService).toBeDefined();
    expect(registeredService).toBeInstanceOf(TestService);
  });

  it('should throw error when decorator is used on non-service class', () => {
    expect(() => {
      @service()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class InvalidClass {}
    }).toThrow(ServiceDecoratorException);
  });

  it('should throw error when class name does not end with Service', () => {
    expect(() => {
      @service()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class TestController {}
    }).toThrow(ServiceDecoratorException);
  });

  it('should register service as singleton', () => {
    @service()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class SingletonService {}

    const instance1 = container.get('SingletonService');
    const instance2 = container.get('SingletonService');

    expect(instance1).toBe(instance2);
  });
});
