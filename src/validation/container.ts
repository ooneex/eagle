import type { ValidatorOptions } from 'class-validator';
import { Collection } from '../collection/Collection';
import type { ValidatorScopeType } from './types';

export const ValidatorContainer: Collection<
  ValidatorScopeType,
  { value: any; options?: ValidatorOptions }[]
> = new Collection<
  ValidatorScopeType,
  { value: any; options?: ValidatorOptions }[]
>([
  ['payload', []],
  ['params', []],
  ['queries', []],
  ['cookies', []],
  ['files', []],
  ['form', []],
]);
