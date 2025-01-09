export interface ISeed {
  execute: (previousData?: unknown) => Promise<unknown> | unknown;
}
