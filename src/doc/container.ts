import { Collection } from '../collection/Collection.ts';
import { Doc } from '../doc/Doc.ts';

/**
 * A collection to store and manage Doc instances with string keys.
 * Acts as a global container for document storage and retrieval.
 */
export const DocContainer = new Collection<
  string,
  Doc
>();
