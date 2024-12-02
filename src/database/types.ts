import type { Metadata } from 'npm:@langchain/community/vectorstores/neo4j_vector';
import type {
  Document,
  DocumentInterface,
} from 'npm:@langchain/core/documents';

/**
 * Configuration type for Vector Database
 * @property {string} url - Database connection URL
 * @property {string} table - Name of the database table
 * @property {object} openai - Optional OpenAI configuration
 * @property {string} openai.key - OpenAI API key
 * @property {string} openai.model - OpenAI model name
 * @property {object} mistral - Optional Mistral configuration
 * @property {string} mistral.key - Mistral API key
 * @property {string} mistral.model - Mistral model name
 */
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

/**
 * Vector Database interface
 * @interface IVectorDatabase
 */
export interface IVectorDatabase {
  /**
   * Get database configuration
   * @returns {VectorDatabaseConfigType} Database configuration object
   */
  getConfig: () => VectorDatabaseConfigType;

  /**
   * Find documents matching query
   * @param {string} query - Search query string
   * @param {object} options - Optional search parameters
   * @param {number} options.k - Number of results to return
   * @param {Metadata} options.filter - Metadata filter
   * @returns {Promise<DocumentInterface[]>} Array of matching documents
   */
  find: (
    query: string,
    options?: { k?: number; filter?: Metadata },
  ) => Promise<DocumentInterface[]>;

  /**
   * Add documents to database
   * @param {Document[]} docs - Array of documents to add
   * @returns {Promise<Document[]>} Array of added documents
   */
  add: (docs: Document[]) => Promise<Document[]>;

  /**
   * Delete documents from database
   * @param {string[]} ids - Array of document IDs to delete
   * @param {object} options - Optional delete parameters
   * @param {Metadata} options.filter - Metadata filter
   * @returns {Promise<void>}
   */
  delete: (ids: string[], options?: { filter?: Metadata }) => Promise<void>;
}
