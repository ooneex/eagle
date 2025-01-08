import { describe, expect, it } from 'bun:test';
import { unitMapper } from './utils.ts';

describe('unitMapper', () => {
  it('should map time units to seconds correctly', () => {
    expect(unitMapper.s).toBe(1);
    expect(unitMapper.m).toBe(60);
    expect(unitMapper.h).toBe(3600);
    expect(unitMapper.d).toBe(86400);
    expect(unitMapper.w).toBe(604800);
    expect(unitMapper.y).toBe(31536000);
  });

  it('should contain all expected time unit keys', () => {
    const expectedKeys = ['s', 'm', 'h', 'd', 'w', 'y'];
    expect(Object.keys(unitMapper).sort()).toEqual(expectedKeys.sort());
  });
});
