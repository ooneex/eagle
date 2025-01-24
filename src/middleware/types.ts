import type { Collection } from '../collection/Collection';
import type { IRequest } from '../request/types';
import type { HttpResponse } from '../response/HttpResponse';
import type { IUser } from '../security/types';

export type MiddlewareContextType = {
  request: IRequest;
  response: HttpResponse;
  store: Collection<string, any>;
  exception?: Error;
  user?: IUser;
  isAuthenticated?: boolean;
  payload?: Record<string, unknown>;
  params?: Record<string, unknown>;
  queries?: Record<string, unknown>;
  cookies?: Record<string, unknown>;
  files?: Record<string, unknown>;
  form?: Record<string, unknown>;
};

export const MiddlewareEvents = [
  'request',
  'response',
  // 'exception',
  // 'kernel:init',
  // 'kernel:finish',
] as const;

export type MiddlewareEventType = (typeof MiddlewareEvents)[number];

export interface IMiddleware {
  next: (
    context: MiddlewareContextType,
  ) => MiddlewareContextType | Promise<MiddlewareContextType>;
}

export type MiddlewareValueType = {
  name: string;
  value: any;
  priority: number;
};
