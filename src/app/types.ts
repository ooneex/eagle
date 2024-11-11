export type ServerListenParamsType = Parameters<typeof Deno.serve>[0];

export interface IEagle {
  listen: (options: ServerListenParamsType) => void;
}
