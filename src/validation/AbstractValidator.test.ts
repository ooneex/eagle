import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { AbstractValidator, ValidatorScopeType } from './mod.ts';

class TestValidator extends AbstractValidator {
  getScope(): ValidatorScopeType {
    return 'test' as ValidatorScopeType;
  }
}

describe('AbstractValidator', () => {
  it('should have a validate method', () => {
    const validator = new TestValidator();
    expect(validator.validate).toBeDefined();
    expect(typeof validator.validate).toBe('function');
  });

  it('should implement getScope method', () => {
    const validator = new TestValidator();
    expect(validator.getScope()).toBe('test');
  });
});
