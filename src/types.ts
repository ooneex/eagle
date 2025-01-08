export type ScalarType = boolean | number | bigint | string;

export type DecoratorConfigType = {
  scope?: 'singleton' | 'transient' | 'request';
};
