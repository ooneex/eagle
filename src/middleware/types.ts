import { IRequest } from '../request/types.ts';
import { IResponse } from '../response/types.ts';

export const MiddlewareScopes = ['request', 'response'] as const;

export type MiddlewareScopeType = (typeof MiddlewareScopes)[number];

export interface IMiddleware {
  execute: (
    context: { request: IRequest; response: IResponse },
  ) => void | Promise<void>;
  getScope: () => MiddlewareScopeType;
  getOrder: () => number;
}
