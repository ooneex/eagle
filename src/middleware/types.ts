import { IRequest } from '../request/types.ts';
import { IResponse } from '../response/types.ts';

export type MiddlewareScopeType = 'request' | 'response';

export interface IMiddleware {
  execute: (
    context?: { request?: IRequest; response?: IResponse },
  ) => IResponse | Promise<IResponse>;
  getScope: () => MiddlewareScopeType;
  getOrder: () => number;
}
