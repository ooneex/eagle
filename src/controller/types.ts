import type {
  IMiddleware,
  MiddlewareContextType,
  MiddlewareEventType,
} from '@/middleware/types.ts';
import type { HttpResponse } from '@/response/HttpResponse.ts';
import type { ERole } from '@/security/types.ts';
import type { ScalarType } from '@/types.ts';
import type { IValidator, ValidatorScopeType } from '@/validation/types.ts';

export type ActionParamType = MiddlewareContextType;

export type ControllerActionType = (
  context: ActionParamType,
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

export type ControllerRouteConfigType = {
  name: string;
  value: any;
  path: string[];
  regexp?: RegExp[];
  method: ControllerMethodType[];
  host?: (string | RegExp)[];
  ip?: (string | RegExp)[];
  validators?: {
    scope: ValidatorScopeType;
    value: IValidator;
  }[];
  middlewares?: {
    event: Extract<MiddlewareEventType, 'request' | 'response'>;
    value: IMiddleware;
    priority?: number;
  }[];
  roles?: ERole[];
};

export type ControllerFindParamType = {
  path: string;
  method: ControllerMethodType;
  host?: string;
  ip?: string;
};

export type ControllerFindReturnType = Required<ControllerRouteConfigType> & {
  params: Record<string, ScalarType>;
};
