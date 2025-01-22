import { beforeEach, describe, expect, it } from 'bun:test';
import { SeedContainer } from '.';

describe('SeedContainer', () => {
  beforeEach(() => {
    // Clear container before each test
    SeedContainer.clear();
  });

  it('should add and retrieve seed entries', () => {
    const seedEntry = {
      value: 'TestSeed',
      order: 1,
      active: true,
    };

    SeedContainer.add(seedEntry);

    expect(SeedContainer.count()).toBe(1);
    expect(SeedContainer.values().next().value).toEqual(seedEntry);
  });

  it('should maintain multiple seed entries', () => {
    const seedEntry1 = {
      value: 'TestSeed1',
      order: 1,
      active: true,
    };

    const seedEntry2 = {
      value: 'TestSeed2',
      order: 2,
      active: true,
    };

    SeedContainer.add(seedEntry1);
    SeedContainer.add(seedEntry2);

    expect(SeedContainer.count()).toBe(2);
    expect(Array.from(SeedContainer.values())).toEqual([
      seedEntry1,
      seedEntry2,
    ]);
  });

  it('should clear all seed entries', () => {
    SeedContainer.add({
      value: 'TestSeed',
      order: 1,
      active: true,
    });

    expect(SeedContainer.count()).toBe(1);

    SeedContainer.clear();

    expect(SeedContainer.count()).toBe(0);
  });
});
