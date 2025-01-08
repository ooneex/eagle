import { describe, expect, it } from 'bun:test';
import { toKebabCase } from '@/helper';

describe('toKebabCase', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(toKebabCase('camelCase')).toBe('camel-case');
    expect(toKebabCase('thisIsATest')).toBe('this-is-a-test');
  });

  it('should convert PascalCase to kebab-case', () => {
    expect(toKebabCase('PascalCase')).toBe('pascal-case');
    expect(toKebabCase('ThisIsATest')).toBe('this-is-a-test');
  });

  it('should convert snake_case to kebab-case', () => {
    expect(toKebabCase('snake_case')).toBe('snake-case');
    expect(toKebabCase('this_is_a_test')).toBe('this-is-a-test');
  });

  it('should handle spaces', () => {
    expect(toKebabCase('This is a test')).toBe('this-is-a-test');
    expect(toKebabCase('  Trim  Spaces  ')).toBe('trim-spaces');
  });

  it('should handle mixed formats', () => {
    expect(toKebabCase('Mix_of_UPPER_and_lower')).toBe(
      'mix-of-upper-and-lower',
    );
    expect(toKebabCase('mixOf_snake_And_camelCase')).toBe(
      'mix-of-snake-and-camel-case',
    );
  });
});
