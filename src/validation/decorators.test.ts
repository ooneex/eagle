import { container } from '@/container/Container.ts';
import {
  AbstractValidator,
  assert,
  IAssert,
  validator,
  ValidatorDecoratorException,
} from '@/validation/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('validator decorator', () => {
  it('should register validator class in container', () => {
    @validator()
    class TestValidator extends AbstractValidator {
      public getScope() {
        return null;
      }
    }

    const registeredValidator = container.get(TestValidator.name, 'validator');
    expect(registeredValidator).toBeDefined();
    expect(registeredValidator).toBeInstanceOf(TestValidator);
  });

  it('should register validator as singleton', () => {
    @validator()
    class SingletonValidator extends AbstractValidator {
      public getScope() {
        return null;
      }
    }

    const instance1 = container.get(SingletonValidator.name, 'validator');
    const instance2 = container.get(SingletonValidator.name, 'validator');

    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on non-validator class', () => {
    expect(() => {
      @validator()
      // @ts-ignore: This is a test
      // deno-lint-ignore no-unused-vars
      class InvalidClass extends AbstractValidator {
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
      class TestService extends AbstractValidator {
        public getScope() {
          return null;
        }
      }
    }).toThrow(ValidatorDecoratorException);
  });

  it('should throw error if class does not have getScope method', () => {
    expect(() => {
      @validator()
      // @ts-ignore: Testing runtime behavior
      // deno-lint-ignore no-unused-vars
      class TestValidator {
        // No getScope method
      }
    }).toThrow(ValidatorDecoratorException);
  });

  it('should throw error if validate method is not defined', () => {
    expect(() => {
      @validator()
      // @ts-ignore: Testing runtime behavior
      // deno-lint-ignore no-unused-vars
      class TestValidator {
        // No validate method
      }
    }).toThrow(ValidatorDecoratorException);
  });

  it('should throw error if validate method does not return ValidationResultType', () => {
    expect(() => {
      @validator()
      // @ts-ignore: Testing runtime behavior
      // deno-lint-ignore no-unused-vars
      class TestValidator {
        public validate() {
          return null;
        }
      }
    }).toThrow(ValidatorDecoratorException);
  });
});

describe('assert decorator', () => {
  it('should register assert decorator', () => {
    @assert()
    class AssertTest implements IAssert {
      validate(_value: unknown) {
        return { success: true, message: 'Valid' };
      }
    }

    const registeredAssert = container.get(AssertTest.name, 'assert');
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
      class TestValidator implements IAssert {
        public randomMethod() {
          return null;
        }
      }
    }).toThrow(ValidatorDecoratorException);
  });
});
