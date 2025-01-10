import { describe, expect, it } from 'bun:test';
import { container } from '@/container';
import {
  type IValidator,
  type ValidationResultType,
  ValidatorContainer,
  ValidatorDecoratorException,
  validator,
} from '@/validation';

describe('Validator Decorator', () => {
  it('should register a valid validator class in the container', () => {
    @validator('payload')
    class TestValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    const instance = container.get<TestValidator>(TestValidator);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestValidator);
  });

  it('should register validator class in the container only once', () => {
    @validator('payload')
    class SingleValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    const instances = container.getAll<SingleValidator>(SingleValidator);
    expect(instances.length).toBe(1);
  });

  it('should register validator class with request scope', () => {
    @validator('payload', { scope: 'request' })
    class RequestScopedValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    const instance1 = container.get<RequestScopedValidator>(
      RequestScopedValidator,
    );
    const instance2 = container.get<RequestScopedValidator>(
      RequestScopedValidator,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register validator class with transient scope', () => {
    @validator('payload', { scope: 'transient' })
    class TransientScopedValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    const instance1 = container.get<TransientScopedValidator>(
      TransientScopedValidator,
    );
    const instance2 = container.get<TransientScopedValidator>(
      TransientScopedValidator,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should throw error for invalid validator class name', () => {
    expect(() => {
      @validator('payload')
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public validate() {
          return {};
        }
      }
    }).toThrow(ValidatorDecoratorException);
  });

  it('should throw error for class without validate method', () => {
    expect(() => {
      @validator('payload')
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class TestValidator {
        public someOtherMethod() {
          return {};
        }
      }
    }).toThrow(ValidatorDecoratorException);
  });

  it('should add validator to correct scope in ValidatorContainer', () => {
    @validator('payload')
    class PayloadValidator implements IValidator {
      public validate(): Promise<ValidationResultType> {
        return Promise.resolve({
          success: true,
          details: [],
        });
      }
    }

    const validators = ValidatorContainer.get('payload');
    expect(validators).toContainEqual({ value: PayloadValidator });
  });
});
