import { describe, expect, it } from 'bun:test';
import { capitalizeWord, splitToWords } from '@/helper';

describe('splitToWords', () => {
  it('should split camelCase words', () => {
    expect(splitToWords('camelCase')).toEqual(['camel', 'Case']);
    expect(splitToWords('thisIsATest')).toEqual(['this', 'Is', 'A', 'Test']);
  });

  it('should split PascalCase words', () => {
    expect(splitToWords('PascalCase')).toEqual(['Pascal', 'Case']);
    expect(splitToWords('ThisIsATest')).toEqual(['This', 'Is', 'A', 'Test']);
  });

  it('should handle acronyms', () => {
    expect(splitToWords('parseJSON')).toEqual(['parse', 'JSON']);
    expect(splitToWords('parseXMLDocument')).toEqual([
      'parse',
      'XML',
      'Document',
    ]);
  });

  it('should handle numbers', () => {
    expect(splitToWords('version2')).toEqual(['version', '2']);
    expect(splitToWords('iOS15Device')).toEqual(['i', 'OS', '15', 'Device']);
  });

  it('should return empty array for empty string', () => {
    expect(splitToWords('')).toEqual([]);
  });
});

describe('capitalizeWord', () => {
  it('should capitalize first letter and lowercase rest', () => {
    expect(capitalizeWord('hello')).toBe('Hello');
    expect(capitalizeWord('WORLD')).toBe('World');
    expect(capitalizeWord('tEsT')).toBe('Test');
  });

  it('should handle single letter', () => {
    expect(capitalizeWord('a')).toBe('A');
    expect(capitalizeWord('Z')).toBe('Z');
  });

  it('should handle empty string', () => {
    expect(capitalizeWord('')).toBe('');
  });

  it('should handle undefined/null input', () => {
    // @ts-ignore
    expect(capitalizeWord(undefined)).toBe(undefined);
    // @ts-ignore
    expect(capitalizeWord(null)).toBe(null);
  });
});
