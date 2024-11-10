import { Exception } from '@/exception/Exception.ts';
import type { ScalarType } from '@/types.ts';

export type ControllerResponseType =
  | ScalarType
  | ReadableStream
  | Response
  | Exception;

export interface IController {
  execute: (...args: unknown[]) => Response | Promise<Response>;
}

export enum EScope {
  /**
   * The provider can be shared across multiple classes. The provider lifetime
   * is strictly tied to the application lifecycle. Once the application has
   * bootstrapped, all providers have been instantiated.
   */
  DEFAULT = 0,
  /**
   * A new private instance of the provider is instantiated for every use
   */
  TRANSIENT = 1,
  /**
   * A new instance is instantiated for each request processing pipeline
   */
  REQUEST = 2,
}

export type MethodType =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export type ControllerOptionsType = {
  methods?: MethodType[];
  paths?: string[];
  hosts?: (string | RegExp)[];
  scope?: EScope;
  controller?: IController;
};
