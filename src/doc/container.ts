import { Collection } from '../collection/Collection.ts';
import { Doc } from '../doc/Doc.ts';

export const DocContainer = new Collection<
  string,
  Doc
>();
