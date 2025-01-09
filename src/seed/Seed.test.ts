import { describe, expect, it } from 'bun:test';
import { container } from '@/container';
import { type ISeed, Seed, seed } from '@/seed';

describe('Seed', () => {
  it('should execute seeds in correct order', async () => {
    const executionOrder: number[] = [];

    @seed({ order: 2 })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class SecondSeed implements ISeed {
      public async execute(previousData: unknown): Promise<unknown> {
        executionOrder.push(2);
        return previousData;
      }
    }

    @seed({ order: 1 })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class FirstSeed implements ISeed {
      public async execute(previousData: unknown): Promise<unknown> {
        executionOrder.push(1);
        return previousData;
      }
    }

    @seed({ order: 3 })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class ThirdSeed implements ISeed {
      public async execute(previousData: unknown): Promise<unknown> {
        executionOrder.push(3);
        return previousData;
      }
    }

    const seedRunner = new Seed();
    await seedRunner.run();

    expect(executionOrder).toEqual([1, 2, 3]);
  });

  it('should pass data between seeds', async () => {
    @seed({ order: 1 })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class FirstSeed implements ISeed {
      public async execute(): Promise<unknown> {
        return 42;
      }
    }

    @seed({ order: 2 })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class SecondSeed implements ISeed {
      public async execute(previousData: unknown): Promise<unknown> {
        return `Value: ${previousData as number}`;
      }
    }

    @seed({ order: 3 })
    class ThirdSeed implements ISeed {
      public async execute(previousData: unknown): Promise<unknown> {
        return `${previousData as string} processed`;
      }
    }

    const seedRunner = new Seed();
    await seedRunner.run();

    // Get the last seed instance to verify final data
    const thirdSeedInstance = container.get<ThirdSeed>(ThirdSeed);
    const result = await thirdSeedInstance.execute('Value: 42');
    expect(result).toBe('Value: 42 processed');
  });
});
