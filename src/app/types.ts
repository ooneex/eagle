import { IValidator } from '../validation/types.ts';

/**
 * Type representing the parameters accepted by Deno.serve()
 */
export type ServerListenParamsType = Parameters<typeof Deno.serve>[0];

/**
 * Possible application environment types
 */
export type AppEnvType =
  | 'development'
  | 'production'
  | 'staging'
  | 'local'
  | 'test';

/**
 * Interface defining the core Eagle server functionality
 */
export interface IEagle {
  /**
   * Starts the server listening on the specified options
   * @param options - Server configuration options
   */
  listen: (options: ServerListenParamsType) => void;
}

/**
 * Configuration options for initializing an Eagle server
 */
export type EagleConfigType = {
  /**
   * Optional array of validator functions to run on requests
   */
  validators?: IValidator[];
};
