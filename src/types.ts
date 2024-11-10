import type { IController } from '@/controller/types.ts';
import type { IMiddleware } from '@/middleware/types.ts';

export type ScalarType = boolean | number | bigint | string;

export type ServerListenParamsType = Parameters<typeof Deno.serve>[0];

export interface IEagle {
  listen: (options: ServerListenParamsType) => void;

  use: (middleware: IMiddleware) => void;
  addController: (controller: IController) => void;
}
