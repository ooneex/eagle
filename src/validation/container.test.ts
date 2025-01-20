import { beforeEach, describe, expect, it } from 'bun:test';
import { ValidatorContainer, type ValidatorScopeType } from '.';

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
    ];

    scopes.map((scope) => {
      const validators = ValidatorContainer.get(scope);
      expect(validators).toBeInstanceOf(Array);
      expect(validators).toHaveLength(0);
    });
  });

  it('should allow adding validators to scopes', () => {
    class TestValidator {}

    ValidatorContainer.get('payload')?.push({ value: TestValidator });

    expect(ValidatorContainer.get('payload')).toContainEqual({
      value: TestValidator,
    });
  });

  it('should maintain separate validator lists per scope', () => {
    class TestValidator1 {}
    class TestValidator2 {}

    ValidatorContainer.get('payload')?.push({ value: TestValidator1 });
    ValidatorContainer.get('params')?.push({ value: TestValidator2 });

    expect(ValidatorContainer.get('payload')).toContainEqual({
      value: TestValidator1,
    });
    expect(ValidatorContainer.get('payload')).not.toContainEqual({
      value: TestValidator2,
    });
    expect(ValidatorContainer.get('params')).toContainEqual({
      value: TestValidator2,
    });
    expect(ValidatorContainer.get('params')).not.toContainEqual({
      value: TestValidator1,
    });
  });
});
