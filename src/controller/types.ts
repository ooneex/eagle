import { IMiddleware } from '../middleware/types.ts';
import { IResponse } from '../response/types.ts';
import { ERole } from '../security/types.ts';
import { IValidator } from '../validation/types.ts';

/**
 * Interface representing a controller object with an action method
 */
export interface IController {
  /**
   * The main action method of the controller that handles requests
   * @param args Any arguments passed to the controller action
   * @returns Response object or Promise of response object
   */
  action: (...args: any[]) => IResponse | Promise<IResponse>;
}

/**
 * Supported HTTP methods for controller actions
 */
export type ControllerMethodType =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

/**
 * Configuration type for storing controller metadata
 */
export type StoreControllerValueType = {
  /** Name of the controller */
  name: string;
  /** Allowed HTTP methods */
  methods?: ControllerMethodType[];
  /** URL paths the controller handles */
  paths?: string[];
  /** Regular expressions for matching paths */
  regexp?: RegExp[];
  /** Allowed hosts (string or RegExp) */
  hosts?: (string | RegExp)[];
  /** Allowed IP addresses (string or RegExp) */
  ips?: (string | RegExp)[];
  /**
   * Validators to be applied
   * No need to decorate those validators with @validator() decorator
   */
  validators?: IValidator[];
  /**
   * Middleware to be applied
   * No need to decorate those validators with @validator() decorator
   */
  middlewares?: IMiddleware[];
  /** Required roles for authorization */
  roles?: ERole[];
};
