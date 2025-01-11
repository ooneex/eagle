import { beforeEach, describe, expect, it } from 'bun:test';
import { container } from '@/container';
import {
  type ISeed,
  SeedContainer,
  SeedDecoratorException,
  seed,
} from '@/seed';

beforeEach(() => {
  SeedContainer.clear();
});

describe('Seed Decorator', () => {
  it('should register a valid seed class in the container', () => {
    @seed()
    class TestSeed implements ISeed {
      public async execute<T = unknown>(previousData?: T): Promise<T> {
        return previousData as T;
      }
    }

    const instance = container.get<TestSeed>(TestSeed);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestSeed);
  });

  it('should register seed class with transient scope', () => {
    @seed({ scope: 'transient' })
    class TransientScopedSeed implements ISeed {
      public async execute<T = unknown>(previousData?: T): Promise<T> {
        return previousData as T;
      }
    }

    const instance1 = container.get<TransientScopedSeed>(TransientScopedSeed);
    const instance2 = container.get<TransientScopedSeed>(TransientScopedSeed);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register seed class with singleton scope by default', () => {
    @seed()
    class SingletonScopedSeed implements ISeed {
      public async execute<T = unknown>(previousData?: T): Promise<T> {
        return previousData as T;
      }
    }

    const instance1 = container.get<SingletonScopedSeed>(SingletonScopedSeed);
    const instance2 = container.get<SingletonScopedSeed>(SingletonScopedSeed);
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    expect(() => {
      @seed()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public execute() {
          return;
        }
      }
    }).toThrow(SeedDecoratorException);

    expect(() => {
      @seed()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class SomeSeed {
        // Missing required methods
      }
    }).toThrow(SeedDecoratorException);
  });

  it('should register seeds with specified order', () => {
    @seed({ order: 2 })
    class SecondSeed implements ISeed {
      public async execute<T = unknown>(previousData?: T): Promise<T> {
        return previousData as T;
      }
    }

    @seed({ order: 1 })
    class FirstSeed implements ISeed {
      public async execute<T = unknown>(previousData?: T): Promise<T> {
        return previousData as T;
      }
    }

    const seeds = Array.from(SeedContainer.values()).sort(
      (a, b) => a.order - b.order,
    );
    expect(seeds.length).toBe(2);
    expect(seeds[0].value).toBe(FirstSeed);
    expect(seeds[1].value).toBe(SecondSeed);
  });

  it('should use order 0 by default when no order specified', () => {
    @seed()
    class DefaultOrderSeed implements ISeed {
      public async execute<T = unknown>(previousData?: T): Promise<T> {
        return previousData as T;
      }
    }

    const seeds = Array.from(SeedContainer.values());
    const defaultSeed = seeds.find((s) => s.value === DefaultOrderSeed);
    expect(defaultSeed?.order).toBe(0);
  });
});
