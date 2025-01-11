import { beforeEach, describe, expect, it } from 'bun:test';
import { MiddlewareContainer } from './container';
import type { MiddlewareValueType } from './types';

beforeEach(() => {
  MiddlewareContainer.clear();
  MiddlewareContainer.add('request', []);
  MiddlewareContainer.add('response', []);
  MiddlewareContainer.add('exception', []);
  MiddlewareContainer.add('kernel:init', []);
  MiddlewareContainer.add('kernel:finish', []);
});

describe('Middleware Dispatch', () => {
  it('should execute middleware in correct order', async () => {
    const executionOrder: string[] = [];

    const firstMiddleware: MiddlewareValueType = {
      name: 'first',
      value: async () => {
        executionOrder.push('first');
      },
      priority: 1,
    };

    const secondMiddleware: MiddlewareValueType = {
      name: 'second',
      value: async () => {
        executionOrder.push('second');
      },
      priority: 2,
    };

    MiddlewareContainer.get('request')?.push(firstMiddleware);
    MiddlewareContainer.get('request')?.push(secondMiddleware);

    expect(MiddlewareContainer.get('request')).toHaveLength(2);
    expect(executionOrder).toHaveLength(0);

    // Execute middleware
    const middlewares = MiddlewareContainer.get('request') || [];
    for (const middleware of middlewares.sort(
      (a, b) => a.priority - b.priority,
    )) {
      await middleware.value();
    }

    expect(executionOrder).toEqual(['first', 'second']);
  });

  it('should execute exception middleware on error', async () => {
    let exceptionHandled = false;

    const errorMiddleware: MiddlewareValueType = {
      name: 'error',
      value: async () => {
        throw new Error('Test error');
      },
      priority: 0,
    };

    const exceptionMiddleware: MiddlewareValueType = {
      name: 'exception',
      value: async () => {
        exceptionHandled = true;
      },
      priority: 0,
    };

    MiddlewareContainer.get('request')?.push(errorMiddleware);
    MiddlewareContainer.get('exception')?.push(exceptionMiddleware);

    const requestMiddlewares = MiddlewareContainer.get('request') || [];
    const exceptionMiddlewares = MiddlewareContainer.get('exception') || [];

    try {
      for (const middleware of requestMiddlewares) {
        await middleware.value();
      }
    } catch (_error) {
      for (const middleware of exceptionMiddlewares) {
        await middleware.value();
      }
    }

    expect(exceptionHandled).toBe(true);
  });
});
