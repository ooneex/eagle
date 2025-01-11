import type { Collection } from '@/collection/Collection.ts';
import type { IRequest } from '@/request/types';
import type { HttpResponse } from '@/response/HttpResponse';

export type MiddlewareContextType = {
  request: IRequest;
  response: HttpResponse;
  store: Collection<string, any>;
  exception?: Error;
};

export const MiddlewareEvents = [
  'request',
  'response',
  'exception',
  'kernel:init',
  'kernel:finish',
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
