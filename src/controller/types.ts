import { IHttpResponse } from '@/response/types.ts';

export interface IController {
  action: (...args: any[]) => IHttpResponse | Promise<IHttpResponse>;
}

export type ControllerMethodType =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export type DecoratorControllerType = {
  new (...args: unknown[]): unknown;
};

export type StoreControllerValueType = {
  methods?: ControllerMethodType[];
  paths?: string[];
  hosts?: (string | RegExp)[];
  controller?: DecoratorControllerType;
};
