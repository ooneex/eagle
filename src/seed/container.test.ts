import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { SeedContainer } from './container.ts';

describe('SeedContainer', () => {
  it('should start empty', () => {
    expect(SeedContainer.count()).toBe(0);
  });

  it('should add and retrieve items', () => {
    SeedContainer.add('test-seed');
    expect(SeedContainer.count()).toBe(1);
    expect(SeedContainer.has('test-seed')).toBe(true);
  });

  it('should remove items', () => {
    SeedContainer.add('temporary-seed');
    expect(SeedContainer.has('temporary-seed')).toBe(true);

    SeedContainer.delete('temporary-seed');
    expect(SeedContainer.has('temporary-seed')).toBe(false);
  });

  it('should clear all items', () => {
    SeedContainer.clear();
    SeedContainer.add('seed1');
    SeedContainer.add('seed2');
    expect(SeedContainer.count()).toBe(2);

    SeedContainer.clear();
    expect(SeedContainer.count()).toBe(0);
  });
});
