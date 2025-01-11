import { describe, expect, it } from 'bun:test';
import {
  type ControllerRouteConfigType,
  dispatchControllerValidators,
} from '@/controller';
import { ValidationFailedException } from '@/validation/ValidationFailedException.ts';
import type { ValidatorScopeType } from '@/validation/types.ts';

describe('dispatchControllerValidators', () => {
  it('should validate data successfully', async () => {
    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
      validators: [
        {
          scope: 'payload' as ValidatorScopeType,
          value: {
            validate: async () => ({ success: true, details: [] }),
            validateSync: () => ({ success: true, details: [] }),
          },
        },
      ],
    };

    expect(
      dispatchControllerValidators({
        dataScope: 'payload',
        data: {},
        routeConfig,
      }),
    ).resolves.toBeUndefined();
  });

  it('should throw ValidationFailedException when validation fails', async () => {
    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
      validators: [
        {
          scope: 'payload' as ValidatorScopeType,
          value: {
            validate: async () => ({
              success: false,
              details: [{ property: 'test', message: 'Invalid data' }],
            }),
            validateSync: () => ({
              success: false,
              details: [{ property: 'test', message: 'Invalid data' }],
            }),
          },
        },
      ],
    };

    expect(
      dispatchControllerValidators({
        dataScope: 'payload',
        data: {},
        routeConfig,
      }),
    ).rejects.toThrow(ValidationFailedException);
  });

  it('should only execute validators for specified scope', async () => {
    const executedValidators: string[] = [];

    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
      validators: [
        {
          scope: 'payload' as ValidatorScopeType,
          value: {
            validate: async () => {
              executedValidators.push('payload');
              return { success: true, details: [] };
            },
            validateSync: () => {
              executedValidators.push('payload-sync');
              return { success: true, details: [] };
            },
          },
        },
        {
          scope: 'queries' as ValidatorScopeType,
          value: {
            validate: async () => {
              executedValidators.push('queries');
              return { success: true, details: [] };
            },
            validateSync: () => {
              executedValidators.push('queries-sync');
              return { success: true, details: [] };
            },
          },
        },
      ],
    };

    await dispatchControllerValidators({
      dataScope: 'payload',
      data: {},
      routeConfig,
    });

    expect(executedValidators).toEqual(['payload']);
  });

  it('should handle routes without validators', async () => {
    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
    };

    expect(
      dispatchControllerValidators({
        dataScope: 'payload',
        data: {},
        routeConfig,
      }),
    ).resolves.toBeUndefined();
  });
});
