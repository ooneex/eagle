import type {
  MiddlewareContextType,
  MiddlewareEventType,
} from '../middleware/types';
import type { ControllerRouteConfigType } from './types';

export const dispatchControllerMiddlewares = async (config: {
  event: Extract<MiddlewareEventType, 'request' | 'response'>;
  context: MiddlewareContextType;
  routeConfig: ControllerRouteConfigType;
}): Promise<MiddlewareContextType> => {
  const middlewares = (config.routeConfig.middlewares ?? [])
    .filter((m) => m.event === config.event)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  let context = config.context;

  for (const middleware of middlewares) {
    context = await middleware.value.next(context);
  }

  return context;
};
