import { describe, expect, it } from 'bun:test';
import { Collection } from '@/collection';
import type { IMiddleware, MiddlewareContextType } from '@/middleware';
import { dispatch, middleware } from '@/middleware';
import { HttpRequest } from '@/request';
import { HttpResponse } from '@/response';

describe('dispatch', () => {
  it('should execute middleware in correct order', async () => {
    const executionOrder: number[] = [];

    @middleware({ on: 'request', order: 1 })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class Test1Middleware implements IMiddleware {
      async next(context: MiddlewareContextType) {
        executionOrder.push(1);
        return context;
      }
    }

    @middleware({ on: 'request', order: 2 })
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class Test2Middleware implements IMiddleware {
      async next(context: MiddlewareContextType) {
        executionOrder.push(2);
        return context;
      }
    }

    const context: MiddlewareContextType = {
      request: new HttpRequest(new Request(new URL('http://localhost:3000'))),
      response: new HttpResponse(),
      store: new Collection<string, any>(),
    };

    await dispatch('request', context);

    expect(executionOrder).toEqual([1, 2]);
  });
});
