import { container } from '@/container/Container.ts';
import {
  assert,
  validator,
  ValidatorDecoratorException,
} from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('validator decorator', () => {
  it('should register validator class in container', () => {
    @validator()
    // @ts-ignore: This is a test
    class TestValidator implements IValidator {
      public getScope() {
        return null;
      }
    }

    const registeredValidator = container.get('TestValidator');
    expect(registeredValidator).toBeDefined();
    expect(registeredValidator).toBeInstanceOf(TestValidator);
  });

  it('should register validator as singleton', () => {
    @validator()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class SingletonValidator implements IValidator {
      public getScope() {
        return null;
      }
    }

    const instance1 = container.get('SingletonValidator');
    const instance2 = container.get('SingletonValidator');

    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on non-validator class', () => {
    expect(() => {
      @validator()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class InvalidClass implements IValidator {
        public getScope() {
          return null;
        }
      }
    }).toThrow(ValidatorDecoratorException);
  });

  it('should throw error when class name does not end with Validator', () => {
    expect(() => {
      @validator()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class TestService implements IValidator {
        public getScope() {
          return null;
        }
      }
    }).toThrow(ValidatorDecoratorException);
  });
});

it('should register assert decorator', () => {
  @assert()
  // @ts-ignore: This is a test
  class AssertTest implements IAssert {
    validate(_value: unknown) {
      return { success: true, message: 'Valid' };
    }
  }

  const registeredAssert = container.get('AssertTest');
  expect(registeredAssert).toBeDefined();
  expect(registeredAssert).toBeInstanceOf(AssertTest);
});

it('should throw error when decorator is used on non-assert class', () => {
  expect(() => {
    @assert()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class InvalidClass {
      // No validate method
    }
  }).toThrow(ValidatorDecoratorException);
});

it('should throw error when class does not implement IAssert', () => {
  expect(() => {
    @assert()
    // @ts-ignore: This is a test
    // deno-lint-ignore no-unused-vars
    class TestValidator implements IValidator {
      public getScope() {
        return null;
      }
    }
  }).toThrow(ValidatorDecoratorException);
});
