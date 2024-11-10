import { parseString } from '@/helper/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('parseString', () => {
  it('should parse integers', () => {
    expect(parseString('123')).toBe(123);
    expect(parseString('0')).toBe(0);
    expect(parseString('-123')).toBe(-123);
  });

  it('should parse floating point numbers', () => {
    expect(parseString('123.45')).toBe(123.45);
    expect(parseString('123,45')).toBe('123,45');
    expect(parseString('-123.45')).toBe(-123.45);
  });

  it('should parse boolean values', () => {
    expect(parseString('true')).toBe(true);
    expect(parseString('TRUE')).toBe(true);
    expect(parseString('false')).toBe(false);
    expect(parseString('FALSE')).toBe(false);
  });

  it('should parse null', () => {
    expect(parseString('null')).toBe(null);
    expect(parseString('NULL')).toBe(null);
  });

  it('should parse arrays', () => {
    expect(parseString('[1, 2, 3]')).toEqual([1, 2, 3]);
    expect(parseString('[true, false]')).toEqual([true, false]);
    expect(parseString('[1.5, 2.5]')).toEqual([1.5, 2.5]);
    expect(parseString('["a", "b"]')).toEqual(['a', 'b']);
  });

  it('should parse JSON objects', () => {
    expect(parseString('{"a": 1}')).toEqual({ a: 1 });
    expect(parseString('{"b": true}')).toEqual({ b: true });
  });

  it('should return original string if parsing fails', () => {
    expect(parseString('hello')).toBe('hello');
    expect(parseString('123abc')).toBe('123abc');
  });

  it('should handle generic type parameter', () => {
    const result = parseString<number[]>('[1, 2, 3]');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([1, 2, 3]);
  });
});
