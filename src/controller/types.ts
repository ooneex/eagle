import type { Collection } from '@/collection/Collection.ts';
import type { IMiddleware } from '@/middleware/types.ts';
import type { IRequest } from '@/request/types.ts';
import type { HttpResponse } from '@/response/HttpResponse.ts';
import type { IValidator } from '@/validation/types.ts';

export type ControllerActionParamType = {
  request: IRequest;
  response: HttpResponse;
  store: Collection<string, any>;
};

export type ControllerActionType = (
  context: ControllerActionParamType,
) => Promise<HttpResponse> | HttpResponse;

export type ControllerMethodType =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export interface IController {
  action: ControllerActionType;
}

export type ControllerPathConfigType = {
  name: string;
  value?: IController;
  methods: ControllerMethodType[];
  paths: string[];
  regexp?: RegExp[];
  hosts?: (string | RegExp)[];
  ips?: (string | RegExp)[];
  validators?: IValidator[];
  middlewares?: IMiddleware[];
};
