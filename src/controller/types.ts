import type { IRequest } from '@/request/types.ts';
import type { HttpResponse } from '@/response/HttpResponse.ts';

export type ControllerActionParamType = {
  request: IRequest;
  response: HttpResponse;
};

export type ControllerActionType = (
  param: ControllerActionParamType,
) => Promise<HttpResponse> | HttpResponse;

export type ControllerMethodType =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';
