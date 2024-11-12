import { IResponse } from '@/response/types.ts';

export interface IController {
  action: (...args: any[]) => IResponse | Promise<IResponse>;
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
  name: string;
  methods?: ControllerMethodType[];
  paths?: string[];
  regexp?: RegExp[];
  hosts?: (string | RegExp)[];
  ips?: (string | RegExp)[];
};
