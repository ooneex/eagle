import { container } from '@/container/Container.ts';
import { validator, ValidatorDecoratorException } from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('validator decorator', () => {
  it('should register validator class in container', () => {
    @validator()
    // @ts-ignore: This is a test
    class TestValidator {}

    const registeredValidator = container.get('TestValidator');
    expect(registeredValidator).toBeDefined();
    expect(registeredValidator).toBeInstanceOf(TestValidator);
  });

  it('should register validator as singleton', () => {
    @validator()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class SingletonValidator {}

    const instance1 = container.get('SingletonValidator');
    const instance2 = container.get('SingletonValidator');

    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on non-validator class', () => {
    expect(() => {
      @validator()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class InvalidClass {}
    }).toThrow(ValidatorDecoratorException);
  });

  it('should throw error when class name does not end with Validator', () => {
    expect(() => {
      @validator()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class TestService {}
    }).toThrow(ValidatorDecoratorException);
  });
});
