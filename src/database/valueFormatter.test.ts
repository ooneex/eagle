import { describe, expect, it } from 'bun:test';
import { formatValueForDatabase } from './valueFormatter';

describe('formatValueForDatabase', () => {
  it('should format Date objects correctly', () => {
    const testDate = new Date('2024-01-01T00:00:00.000Z');
    const result = formatValueForDatabase(testDate);
    expect(result).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should format arrays of primitive values correctly', () => {
    const testArray = [1, 'test', true];
    const result = formatValueForDatabase(testArray);
    expect(result).toEqual([1, 'test', true]);
  });

  it('should format arrays containing Date objects correctly', () => {
    const testDate = new Date('2024-01-01T00:00:00.000Z');
    const testArray = [testDate, 'test', 123];
    const result = formatValueForDatabase(testArray);
    expect(result).toEqual(['2024-01-01T00:00:00.000Z', 'test', 123]);
  });

  it('should format primitive values correctly', () => {
    expect(formatValueForDatabase('string')).toBe('string');
    expect(formatValueForDatabase(123)).toBe(123);
    expect(formatValueForDatabase(true)).toBe(true);
    expect(formatValueForDatabase(null)).toBe(null);
  });

  it('should format objects correctly', () => {
    const testObject = {
      key: 'value',
      number: 123,
      date: new Date('2024-01-01T00:00:00.000Z'),
    };
    const result = formatValueForDatabase(testObject);
    expect(result).toEqual({
      key: 'value',
      number: 123,
      date: '2024-01-01T00:00:00.000Z',
    });
  });

  it('should handle empty arrays', () => {
    const result = formatValueForDatabase([]);
    expect(result).toEqual([]);
  });

  it('should format complex arrays with multiple Date objects and nested structures', () => {
    const testArray = [new Date('2024-01-01T00:00:00.000Z'), 'test'];
    const result = formatValueForDatabase(testArray);
    expect(result).toEqual(['2024-01-01T00:00:00.000Z', 'test']);
  });
});
