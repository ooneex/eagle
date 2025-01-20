import { describe, expect, it } from 'bun:test';
import { container } from '../container';
import { MiddlewareDecoratorException } from './MiddlewareDecoratorException';
import { MiddlewareContainer } from './container';
import { middleware } from './decorators';
import type {
  IMiddleware,
  MiddlewareContextType,
  MiddlewareValueType,
} from './types';

describe('Middleware Decorator', () => {
  it('should register a valid middleware class in the container', () => {
    @middleware({ on: 'request' })
    class TestMiddleware implements IMiddleware {
      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
      }
    }

    const instance = container.get<TestMiddleware>(TestMiddleware);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestMiddleware);
  });

  it('should register middleware class in the container only once', () => {
    @middleware({ on: 'request' })
    class SingleMiddleware implements IMiddleware {
      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
      }
    }

    const instances = container.getAll<SingleMiddleware>(SingleMiddleware);
    expect(instances.length).toBe(1);
  });

  it('should register middleware class with transient scope', () => {
    @middleware({ scope: 'transient', on: 'request' })
    class TransientScopedMiddleware implements IMiddleware {
      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
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
    @middleware({ on: 'request' })
    class SingletonScopedMiddleware implements IMiddleware {
      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
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
      @middleware({ on: 'request' })
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class InvalidClass {
        public next() {
          return;
        }
      }
    }).toThrow(MiddlewareDecoratorException);

    expect(() => {
      @middleware({ on: 'request' })
      // biome-ignore lint/correctness/noUnusedVariables: trust me
      class SomeMiddleware {
        // Missing required methods
      }
    }).toThrow(MiddlewareDecoratorException);
  });

  it('should properly inject dependencies in middleware classes', () => {
    @middleware({ on: 'request' })
    class DependencyMiddleware implements IMiddleware {
      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
      }
    }

    @middleware({ on: 'request' })
    class InjectedMiddleware implements IMiddleware {
      constructor(public dependency: DependencyMiddleware) {}

      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
      }
    }

    const instance = container.resolve<InjectedMiddleware>(InjectedMiddleware);

    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(InjectedMiddleware);
    expect(instance.dependency).toBeDefined();
    expect(instance.dependency).toBeInstanceOf(DependencyMiddleware);
  });

  it('should register middleware with request event', () => {
    MiddlewareContainer.add('request', []);

    @middleware({ on: 'request' })
    class RequestMiddleware implements IMiddleware {
      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
      }
    }

    const requestMiddlewares =
      MiddlewareContainer.get<MiddlewareValueType[]>('request');
    expect(requestMiddlewares).toBeDefined();
    expect(requestMiddlewares?.length).toBe(1);
    expect(requestMiddlewares?.[0].value).toBe(RequestMiddleware);
  });

  it('should register middleware with response event', () => {
    MiddlewareContainer.add('response', []);

    @middleware({ on: 'response' })
    class ResponseMiddleware implements IMiddleware {
      public next(
        context: MiddlewareContextType,
      ): MiddlewareContextType | Promise<MiddlewareContextType> {
        return context;
      }
    }

    const responseMiddlewares =
      MiddlewareContainer.get<MiddlewareValueType[]>('response');
    expect(responseMiddlewares).toBeDefined();
    expect(responseMiddlewares?.length).toBe(1);
    expect(responseMiddlewares?.[0].value).toBe(ResponseMiddleware);
  });
});
