import type * as icon from 'log-symbols';
import type * as colors from '../command/colors';
import type { toKebabCase, toPascalCase } from '../helper';

export type SeedParamType = {
  previousData?: unknown;
  log: {
    error: (message: string) => void;
    info: (message: string) => void;
    message: (message: string) => void;
    step: (message: string) => void;
    success: (message: string) => void;
    warning: (message: string) => void;
    intro: (message: string) => void;
    outro: (message: string) => void;
  };
  color: typeof colors;
  icon: typeof icon.default;
  toPascalCase: typeof toPascalCase;
  toKebabCase: typeof toKebabCase;
};

export interface ISeed {
  execute: (context: SeedParamType) => Promise<unknown> | unknown;
}
