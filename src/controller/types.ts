import { IHttpResponse } from '@/response/types.ts';

export interface IController {
  action: (...args: unknown[]) => IHttpResponse | Promise<IHttpResponse>;
}

export type ControllerMethodType =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export type StoreControllerValueType = {
  methods?: ControllerMethodType[];
  paths?: string[];
  hosts?: (string | RegExp)[];
  controller?: IController;
};
