import { container } from '@/container/container.ts';
import { MiddlewareContainer } from './container.ts';
import type {
  IMiddleware,
  MiddlewareContextType,
  MiddlewareEventType,
} from './types.ts';

export const dispatchMiddlewares = async (
  event: MiddlewareEventType,
  context: MiddlewareContextType,
): Promise<MiddlewareContextType> => {
  const middlewares = (MiddlewareContainer.get(event) ?? []).sort(
    (a, b) => a.priority - b.priority,
  );

  for (const middleware of middlewares) {
    const instance = container.get(middleware.value) as IMiddleware;

    if (!instance) {
      continue;
    }

    context = await instance.next(context);
  }

  return context;
};
