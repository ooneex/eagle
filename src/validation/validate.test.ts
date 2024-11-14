import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import {
  AssertString,
  AssertUndefined,
  ValidatorScopeType,
} from '@/validation/mod.ts';
import { container } from '@/container/mod.ts';
import { DocContainer } from '@/doc/container.ts';
import { ValidationException } from '@/validation/mod.ts';
import { AbstractValidator } from '@/validation/mod.ts';

class TestValidator extends AbstractValidator {
  prop1!: string;
  prop2!: number;

  public getScope(): ValidatorScopeType {
    return null;
  }
}

describe('validate', () => {
  it('should throw ValidationException when validator definition not found', () => {
    const validator = new TestValidator();
    const data = {};

    DocContainer.get = () => undefined;

    expect(() => validator.validate(data)).toThrow(ValidationException);
  });

  it('should validate optional properties', () => {
    const validator = new TestValidator();
    const data = {};

    DocContainer.get = () =>
      ({
        findProperties: () => [{
          name: 'prop1',
          isOptional: true,
          types: ['AssertUndefined'],
        }],
      }) as any;

    container.get = () => new AssertUndefined() as any;

    const result = validator.validate(data);

    expect(result.success).toBe(true);
    expect(result.details[0].success).toBe(true);
  });

  it('should validate assertion types', () => {
    const validator = new TestValidator();
    const data = { prop1: 'test' };

    DocContainer.get = () =>
      ({
        findProperties: () => [{
          name: 'prop1',
          isOptional: false,
          types: ['AssertString'],
        }],
      }) as any;

    container.get = () => new AssertString() as any;

    const result = validator.validate(data);

    expect(result.success).toBe(true);
    expect(result.details[0].success).toBe(true);
  });

  it('should validate constraint types', () => {
    const validator = new TestValidator();
    const data = {
      prop1: {
        constructor: { name: 'SomeType' },
      },
    };

    DocContainer.get = () =>
      ({
        findProperties: () => [{
          name: 'prop1',
          isOptional: false,
          types: ['SomeType'],
        }],
      }) as any;

    container.get = () =>
      ({
        constructor: { name: 'SomeType' },
      }) as any;

    const result = validator.validate(data);

    expect(result.success).toBe(true);
    expect(result.details[0].success).toBe(true);
  });

  it('should validate array constraints', () => {
    const validator = new TestValidator();
    const data = {
      prop1: [{
        constructor: { name: 'SomeType' },
      }],
    };

    DocContainer.get = () =>
      ({
        findProperties: () => [{
          name: 'prop1',
          isOptional: false,
          types: ['SomeType[]'],
        }],
      }) as any;

    container.get = () =>
      ({
        constructor: { name: 'SomeType' },
      }) as any;

    const result = validator.validate(data);

    expect(result.success).toBe(true);
    expect(result.details[0].success).toBe(true);
  });

  it('should fail validation when no valid type found', () => {
    const validator = new TestValidator();
    const data = { prop1: 'invalid' };

    DocContainer.get = () =>
      ({
        findProperties: () => [{
          name: 'prop1',
          isOptional: false,
          types: ['SomeType'],
        }],
      }) as any;

    container.get = () =>
      ({
        constructor: { name: 'DifferentType' },
      }) as any;

    const result = validator.validate(data);

    expect(result.success).toBe(false);
    expect(result.details[0].success).toBe(false);
  });
});
