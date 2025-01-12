import { describe, expect, test } from 'bun:test';
import { toPascalCase } from './toPascalCase.ts';

describe('toPascalCase', () => {
  test('should convert kebab case to pascal case', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
  });

  test('should convert snake case to pascal case', () => {
    expect(toPascalCase('hello_world')).toBe('HelloWorld');
  });

  test('should convert space separated words to pascal case', () => {
    expect(toPascalCase('hello world')).toBe('HelloWorld');
  });

  test('should handle mixed separators', () => {
    expect(toPascalCase('hello-world_test case')).toBe('HelloWorldTestCase');
  });

  test('should trim whitespace', () => {
    expect(toPascalCase('  hello  world  ')).toBe('HelloWorld');
  });

  test('should handle single word', () => {
    expect(toPascalCase('hello')).toBe('Hello');
  });

  test('should handle empty string', () => {
    expect(toPascalCase('')).toBe('');
  });
});
