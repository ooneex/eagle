import { IMiddleware } from '../middleware/types.ts';
import { IResponse } from '../response/types.ts';
import { ERole } from '../security/types.ts';
import { IValidator } from '../validation/types.ts';

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
  /**
   * No need to decorate those validators with @validator() decorator
   */
  validators?: IValidator[];
  /**
   * No need to decorate those validators with @validator() decorator
   */
  middlewares?: IMiddleware[];
  roles?: ERole[];
};
