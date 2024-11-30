import type { Metadata } from 'npm:@langchain/community/vectorstores/neo4j_vector';
import type {
  Document,
  DocumentInterface,
} from 'npm:@langchain/core/documents';

export type VectorDatabaseConfigType = {
  url: string;
  table: string;
  openai?: {
    key: string;
    model: string;
  };
  mistral?: {
    key: string;
    model: string;
  };
};

export interface IVectorDatabase {
  getConfig: () => VectorDatabaseConfigType;
  find: (
    query: string,
    options?: { k?: number; filter?: Metadata },
  ) => Promise<DocumentInterface[]>;
  add: (docs: Document[]) => Promise<Document[]>;
  delete: (ids: string[], options?: { filter?: Metadata }) => Promise<void>;
}
