export type ScalarType = boolean | number | bigint | string;

export type DecoratorScopeType = {
  scope?: 'singleton' | 'transient' | 'request';
};
