import { Collection } from '@/collection/Collection.ts';
import { ClassDocType } from '@/doc/types.ts';

export const DocContainer = new Collection<
  string,
  ClassDocType
>();
