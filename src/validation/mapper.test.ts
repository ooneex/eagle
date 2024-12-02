import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { assertMapper } from './mapper.ts';

describe('assertMapper', () => {
  it('should have correct mapping for primitive types', () => {
    expect(assertMapper.string).toBe('AssertString');
    expect(assertMapper.number).toBe('AssertNumber');
    expect(assertMapper.boolean).toBe('AssertBoolean');
    expect(assertMapper.bigint).toBe('AssertBigint');
    expect(assertMapper.undefined).toBe('AssertUndefined');
    expect(assertMapper.null).toBe('AssertNull');
  });

  it('should have correct mapping for array types', () => {
    expect(assertMapper.Array).toBe('AssertArray');
    expect(assertMapper.stringArray).toBe('AssertStringArray');
    expect(assertMapper.numberArray).toBe('AssertNumberArray');
    expect(assertMapper.booleanArray).toBe('AssertBooleanArray');
    expect(assertMapper.bigintArray).toBe('AssertBigintArray');
    expect(assertMapper.nullArray).toBe('AssertNullArray');
    expect(assertMapper.undefinedArray).toBe('AssertUndefinedArray');
  });

  it('should have correct mapping for Date types', () => {
    expect(assertMapper.Date).toBe('AssertDate');
    expect(assertMapper.DateArray).toBe('AssertDateArray');
  });

  it('should contain all expected keys', () => {
    const expectedKeys = [
      'Array',
      'string',
      'stringArray',
      'null',
      'nullArray',
      'number',
      'numberArray',
      'boolean',
      'booleanArray',
      'undefined',
      'undefinedArray',
      'Date',
      'DateArray',
      'bigint',
      'bigintArray',
    ];

    expect(Object.keys(assertMapper).sort()).toEqual(expectedKeys.sort());
  });
});
