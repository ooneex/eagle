import { describe, expect, it } from 'bun:test';
import { Collection } from '@/collection/Collection.ts';
import {
  type ControllerRouteConfigType,
  dispatchControllerMiddlewares,
} from '@/controller';
import type { MiddlewareContextType } from '@/middleware/types.ts';

describe('dispatchControllerMiddlewares', () => {
  it('should execute middlewares in priority order', async () => {
    const executionOrder: string[] = [];

    const context: MiddlewareContextType = {
      request: {} as any,
      response: {} as any,
      store: new Collection(),
    };

    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
      middlewares: [
        {
          event: 'request',
          priority: 2,
          value: {
            next: async (ctx) => {
              executionOrder.push('second');
              return ctx;
            },
          },
        },
        {
          event: 'request',
          priority: 1,
          value: {
            next: async (ctx) => {
              executionOrder.push('first');
              return ctx;
            },
          },
        },
      ],
    };

    await dispatchControllerMiddlewares({
      event: 'request',
      context,
      routeConfig,
    });

    expect(executionOrder).toEqual(['first', 'second']);
  });

  it('should only execute middlewares for specified event', async () => {
    const executionOrder: string[] = [];

    const context: MiddlewareContextType = {
      request: {} as any,
      response: {} as any,
      store: new Collection(),
    };

    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
      middlewares: [
        {
          event: 'request',
          value: {
            next: async (ctx) => {
              executionOrder.push('request');
              return ctx;
            },
          },
        },
        {
          event: 'response',
          value: {
            next: async (ctx) => {
              executionOrder.push('response');
              return ctx;
            },
          },
        },
      ],
    };

    await dispatchControllerMiddlewares({
      event: 'request',
      context,
      routeConfig,
    });

    expect(executionOrder).toEqual(['request']);
  });

  it('should modify context store', async () => {
    const context: MiddlewareContextType = {
      request: {} as any,
      response: {} as any,
      store: new Collection(),
    };

    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
      middlewares: [
        {
          event: 'request',
          value: {
            next: async (ctx) => {
              ctx.store.add('modified', true);
              return ctx;
            },
          },
        },
      ],
    };

    const result = await dispatchControllerMiddlewares({
      event: 'request',
      context,
      routeConfig,
    });

    expect(result.store.get('modified') as boolean).toBe(true);
  });

  it('should handle routes without middlewares', async () => {
    const context: MiddlewareContextType = {
      request: {} as any,
      response: {} as any,
      store: new Collection(),
    };

    const routeConfig: ControllerRouteConfigType = {
      name: 'test',
      value: {},
      path: [],
      method: ['GET'],
    };

    const result = await dispatchControllerMiddlewares({
      event: 'request',
      context,
      routeConfig,
    });

    expect(result).toBe(context);
  });
});
