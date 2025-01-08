import type { IRequest } from '@/request/types';
import type { HttpResponse } from '@/response/HttpResponse';
import type { ScopeType } from '@/types';

export type MiddlewareContextType = {
  request?: IRequest;
  response?: HttpResponse;
};

export interface IMiddleware {
  execute: (
    context?: MiddlewareContextType,
  ) => HttpResponse | Promise<HttpResponse>;
  getScope: () => ScopeType;
  getOrder: () => number;
}
