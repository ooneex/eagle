import type { Collection } from '@/collection/Collection.ts';
import type { IRequest } from '@/request/types.ts';
import type { HttpResponse } from '@/response/HttpResponse.ts';
import type { ERole } from '@/security/types.ts';
import type { ScalarType } from '@/types.ts';

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
  value: any;
  path: string[];
  regexp?: RegExp[];
  method: ControllerMethodType[];
  host?: (string | RegExp)[];
  ip?: (string | RegExp)[];
  validators?: any[];
  middlewares?: any[];
  roles?: ERole[];
};

export type ControllerFindParamType = {
  path: string;
  method: ControllerMethodType;
  host?: string;
  ip?: string;
};

export type ControllerFindReturnType = Required<ControllerPathConfigType> & {
  params: Record<string, ScalarType>;
};
