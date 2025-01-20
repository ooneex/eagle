import { describe, expect, it } from 'bun:test';
import type { ValidatorScopeType } from '../validation';
import { ValidationFailedException } from '../validation';
import { dispatchControllerValidators } from './dispatchControllerValidators';
import type { ControllerRouteConfigType } from './types';

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
            validate: async () => ({ success: true, details: [], logs: [] }),
            validateSync: () => ({ success: true, details: [], logs: [] }),
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
              details: [
                {
                  property: 'test',
                  value: 'test',
                  constraints: [{ name: 'test', message: 'Invalid data' }],
                },
              ],
              logs: [],
            }),
            validateSync: () => ({
              success: false,
              details: [
                {
                  property: 'test',
                  value: 'test',
                  constraints: [{ name: 'test', message: 'Invalid data' }],
                },
              ],
              logs: [],
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
              return { success: true, details: [], logs: [] };
            },
            validateSync: () => {
              executedValidators.push('payload-sync');
              return { success: true, details: [], logs: [] };
            },
          },
        },
        {
          scope: 'queries' as ValidatorScopeType,
          value: {
            validate: async () => {
              executedValidators.push('queries');
              return { success: true, details: [], logs: [] };
            },
            validateSync: () => {
              executedValidators.push('queries-sync');
              return { success: true, details: [], logs: [] };
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
