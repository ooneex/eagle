import { container } from '@/container/container.ts';
import type { DecoratorScopeType } from '@/types.ts';
import { MiddlewareDecoratorException } from './MiddlewareDecoratorException.ts';
import { MiddlewareContainer } from './container.ts';
import type { MiddlewareEventType } from './types.ts';

export const middleware = (options: {
  scope?: DecoratorScopeType;
  on: MiddlewareEventType;
  order?: number;
  name?: string;
}): ClassDecorator => {
  return (middleware: any) => {
    const name = middleware.prototype.constructor.name;
    ensureIsMiddleware(name, middleware);

    if (options?.scope === 'transient') {
      container.bind(middleware).toSelf().inTransientScope();
    } else {
      container.bind(middleware).toSelf().inSingletonScope();
    }

    MiddlewareContainer.get(options.on)?.push({
      name: options.name ?? name,
      value: middleware,
      order: options?.order ?? 0,
    });
  };
};

const ensureIsMiddleware = (name: string, middleware: any): void => {
  if (!name.endsWith('Middleware') || !middleware.prototype.next) {
    throw new MiddlewareDecoratorException(
      `Middleware decorator can only be used on middleware classes. ${name} must end with Middleware keyword and implement IMiddleware interface.`,
    );
  }
};
