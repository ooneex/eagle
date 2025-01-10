import { Collection } from '@/collection/Collection.ts';
import type { ValidatorScopeType } from './types';

export const ValidatorContainer = new Collection<ValidatorScopeType, any[]>([
  ['payload', []],
  ['params', []],
  ['queries', []],
  ['cookies', []],
  ['files', []],
  ['form', []],
  ['env', []],
]);
