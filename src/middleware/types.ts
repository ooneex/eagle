import { IRequest } from '../request/types.ts';
import { IResponse } from '../response/types.ts';

/**
 * Array of valid middleware execution scopes
 */
export const MiddlewareScopes = ['request', 'response'] as const;

/**
 * Type representing valid middleware scope values
 */
export type MiddlewareScopeType = (typeof MiddlewareScopes)[number];

/**
 * Interface for middleware implementation
 */
export interface IMiddleware {
  /**
   * Executes the middleware logic
   * @param context Object containing request and response instances
   */
  execute: (
    context: { request: IRequest; response: IResponse },
  ) => void | Promise<void>;

  /**
   * Returns the scope this middleware runs in
   */
  getScope: () => MiddlewareScopeType;

  /**
   * Returns the execution order of this middleware
   */
  getOrder: () => number;
}
