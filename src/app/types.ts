import { IValidator } from '../validation/types.ts';

export type ServerListenParamsType = Parameters<typeof Deno.serve>[0];

export type AppEnvType =
  | 'development'
  | 'production'
  | 'staging'
  | 'local'
  | 'test';

export interface IEagle {
  listen: (options: ServerListenParamsType) => void;
}

export type EagleConfigType = {
  validators?: IValidator[];
};
