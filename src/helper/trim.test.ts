import { trim } from '@/helper/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('trim', () => {
  it('should trim spaces from both ends by default', () => {
    expect(trim('  hello  ')).toBe('hello');
    expect(trim('hello  ')).toBe('hello');
    expect(trim('  hello')).toBe('hello');
    expect(trim('hello')).toBe('hello');
  });

  it('should trim specified character from both ends', () => {
    expect(trim('###hello###', '#')).toBe('hello');
    expect(trim('...test...', '.')).toBe('test');
    expect(trim('__world__', '_')).toBe('world');
  });

  it('should handle empty strings', () => {
    expect(trim('')).toBe('');
    expect(trim('   ')).toBe('');
    expect(trim('###', '#')).toBe('');
  });

  it('should handle strings with mixed characters', () => {
    expect(trim('#hello world#', '#')).toBe('hello world');
    expect(trim('  hello#world  ')).toBe('hello#world');
  });
});
