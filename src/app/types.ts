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
