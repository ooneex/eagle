import { describe, expect, it } from 'bun:test';
import { container } from '@/container';
import {
  type IMiddleware,
  type MiddlewareContextType,
  MiddlewareDecoratorException,
  middleware,
} from '@/middleware';
import type { HttpResponse } from '@/response';
import type { ScopeType } from '@/types';

describe('Middleware Decorator', () => {
  it('should register a valid middleware class in the container', () => {
    @middleware()
    class TestMiddleware implements IMiddleware {
      public execute(
        context?: MiddlewareContextType,
      ): HttpResponse | Promise<HttpResponse> {
        return context?.response ?? ({} as HttpResponse);
      }

      public getScope(): ScopeType {
        return 'request';
      }

      public getOrder() {
        return 0;
      }
    }

    const instance = container.get<TestMiddleware>(TestMiddleware);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestMiddleware);
  });

  it('should register middleware class with request scope', () => {
    @middleware({ scope: 'request' })
    class RequestScopedMiddleware implements IMiddleware {
      public execute(
        context?: MiddlewareContextType,
      ): HttpResponse | Promise<HttpResponse> {
        return context?.response ?? ({} as HttpResponse);
      }

      public getScope(): ScopeType {
        return 'request';
      }

      public getOrder() {
        return 0;
      }
    }

    const instance1 = container.get<RequestScopedMiddleware>(
      RequestScopedMiddleware,
    );
    const instance2 = container.get<RequestScopedMiddleware>(
      RequestScopedMiddleware,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register middleware class with transient scope', () => {
    @middleware({ scope: 'transient' })
    class TransientScopedMiddleware implements IMiddleware {
      public execute(
        context?: MiddlewareContextType,
      ): HttpResponse | Promise<HttpResponse> {
        return context?.response ?? ({} as HttpResponse);
      }

      public getScope(): ScopeType {
        return 'request';
      }

      public getOrder() {
        return 0;
      }
    }

    const instance1 = container.get<TransientScopedMiddleware>(
      TransientScopedMiddleware,
    );
    const instance2 = container.get<TransientScopedMiddleware>(
      TransientScopedMiddleware,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).not.toBe(instance2);
  });

  it('should register middleware class with singleton scope by default', () => {
    @middleware()
    class SingletonScopedMiddleware implements IMiddleware {
      public execute(
        context?: MiddlewareContextType,
      ): HttpResponse | Promise<HttpResponse> {
        return context?.response ?? ({} as HttpResponse);
      }

      public getScope(): ScopeType {
        return 'request';
      }

      public getOrder() {
        return 0;
      }
    }

    const instance1 = container.get<SingletonScopedMiddleware>(
      SingletonScopedMiddleware,
    );
    const instance2 = container.get<SingletonScopedMiddleware>(
      SingletonScopedMiddleware,
    );
    expect(instance1).toBeDefined();
    expect(instance2).toBeDefined();
    expect(instance1).toBe(instance2);
  });

  it('should throw error when decorator is used on invalid class', () => {
    expect(() => {
      @middleware()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public execute() {
          return;
        }
      }
    }).toThrow(MiddlewareDecoratorException);

    expect(() => {
      @middleware()
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class SomeMiddleware {
        // Missing required methods
      }
    }).toThrow(MiddlewareDecoratorException);
  });

  it('should properly inject dependencies in middleware classes', () => {
    @middleware()
    class DependencyMiddleware implements IMiddleware {
      public execute(
        context?: MiddlewareContextType,
      ): HttpResponse | Promise<HttpResponse> {
        return context?.response ?? ({} as HttpResponse);
      }

      public getScope(): ScopeType {
        return 'request';
      }

      public getOrder() {
        return 0;
      }
    }

    @middleware()
    class InjectedMiddleware implements IMiddleware {
      constructor(public dependency: DependencyMiddleware) {}

      public execute(
        context?: MiddlewareContextType,
      ): HttpResponse | Promise<HttpResponse> {
        return context?.response ?? ({} as HttpResponse);
      }

      public getScope(): ScopeType {
        return 'request';
      }

      public getOrder() {
        return 0;
      }
    }

    const instance = container.get<InjectedMiddleware>(InjectedMiddleware);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedMiddleware);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyMiddleware);
  });
});
