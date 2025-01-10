import { beforeEach, describe, expect, it } from 'bun:test';
import { ValidatorContainer, type ValidatorScopeType } from '@/validation';

beforeEach(() => {
  ValidatorContainer.clear();
  ValidatorContainer.add('payload', []);
  ValidatorContainer.add('params', []);
  ValidatorContainer.add('queries', []);
  ValidatorContainer.add('cookies', []);
  ValidatorContainer.add('files', []);
  ValidatorContainer.add('form', []);
  ValidatorContainer.add('env', []);
});

describe('ValidatorContainer', () => {
  it('should initialize with empty arrays for all scopes', () => {
    const scopes: ValidatorScopeType[] = [
      'payload',
      'params',
      'queries',
      'cookies',
      'files',
      'form',
      'env',
    ];

    scopes.map((scope) => {
      const validators = ValidatorContainer.get(scope);
      expect(validators).toBeInstanceOf(Array);
      expect(validators).toHaveLength(0);
    });
  });

  it('should allow adding validators to scopes', () => {
    class TestValidator {}

    ValidatorContainer.get('payload')?.push(TestValidator);

    expect(ValidatorContainer.get('payload')).toContain(TestValidator);
  });

  it('should maintain separate validator lists per scope', () => {
    class TestValidator1 {}
    class TestValidator2 {}

    ValidatorContainer.get('payload')?.push(TestValidator1);
    ValidatorContainer.get('params')?.push(TestValidator2);

    expect(ValidatorContainer.get('payload')).toContain(TestValidator1);
    expect(ValidatorContainer.get('payload')).not.toContain(TestValidator2);
    expect(ValidatorContainer.get('params')).toContain(TestValidator2);
    expect(ValidatorContainer.get('params')).not.toContain(TestValidator1);
  });
});
