import type { IRequest } from '@/request/types';
import type { HttpResponse } from '@/response/HttpResponse';

export type MiddlewareContextType = {
  request?: IRequest;
  response?: HttpResponse;
};

export const MiddlewareScopes = [
  'request',
  'response',
  'kernel:init',
  'kernel:finish',
] as const;

export type MiddlewareScopeType = (typeof MiddlewareScopes)[number];

export interface IMiddleware {
  execute: (
    context?: MiddlewareContextType,
  ) => HttpResponse | Promise<HttpResponse>;
  getScope: () => MiddlewareScopeType;
  getOrder: () => number;
}
