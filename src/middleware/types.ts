import type { Collection } from '@/collection/Collection.ts';
import type { IRequest } from '@/request/types';
import type { HttpResponse } from '@/response/HttpResponse';
import type { ScalarType } from '@/types';

export type MiddlewareContextType = {
  request?: IRequest;
  response?: HttpResponse;
  store?: Collection<string, ScalarType | null>;
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
    context?: MiddlewareContextType,
  ) => HttpResponse | Promise<HttpResponse>;
}

export type MiddlewareValueType = {
  name: string;
  value: any;
  order: number;
};
