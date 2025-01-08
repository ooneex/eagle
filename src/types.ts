export type ScalarType = boolean | number | bigint | string;

export type DecoratorScopeType = {
  scope?: 'singleton' | 'transient' | 'request';
};

export const Scopes = [
  'request',
  'response',
  'kernel:init',
  'kernel:finish',
] as const;

export type ScopeType = (typeof Scopes)[number];
