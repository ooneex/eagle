import type { Metadata } from 'npm:@langchain/community/vectorstores/neo4j_vector';
import { PGVectorStore } from 'npm:@langchain/community/vectorstores/pgvector';
import type {
  Document,
  DocumentInterface,
} from 'npm:@langchain/core/documents';
import { OpenAIEmbeddings } from 'npm:@langchain/openai';
import { IVectorDatabase, VectorDatabaseConfigType } from '../types.ts';
import { getConnection } from './connection.ts';
import { VectorDatabaseException } from './VectorDatabaseException.ts';

/**
 * Abstract base class implementing vector database operations
 */
export abstract class AbstractVectorDatabase implements IVectorDatabase {
  /**
   * Abstract method to get vector database configuration
   * @returns The vector database configuration
   */
  public abstract getConfig(): VectorDatabaseConfigType;

  /**
   * Find similar documents based on a query string
   * @param query - The search query string
   * @param options - Search options including number of results and filter
   * @returns Array of matching documents
   */
  public async find(
    query: string,
    options?: { k?: number; filter?: Metadata },
  ): Promise<DocumentInterface[]> {
    const { k = 1, filter = {} } = options ?? {};
    const config = this.getConfig();
    const embeddings = this.getEmbeddings();

    const vectorStore = await PGVectorStore.initialize(
      embeddings,
      getConnection(config.url, config.table),
    );
    const docs = await vectorStore.similaritySearch(query, k, filter);
    await vectorStore.end();

    return docs;
  }

  /**
   * Add documents to the vector store
   * @param docs - Array of documents to add
   * @returns The added documents
   */
  public async add(docs: Document[]): Promise<Document[]> {
    const config = this.getConfig();
    const embeddings = this.getEmbeddings();

    const vectorStore = await PGVectorStore.initialize(
      embeddings,
      getConnection(config.url, config.table),
    );
    await vectorStore.addDocuments(docs);
    await vectorStore.end();

    return docs;
  }

  /**
   * Delete documents from the vector store
   * @param ids - Optional array of document IDs to delete
   * @param options - Delete options including filter
   */
  public async delete(
    ids?: string[],
    options?: { filter?: Metadata },
  ): Promise<void> {
    const config = this.getConfig();
    const embeddings = this.getEmbeddings();

    const vectorStore = await PGVectorStore.initialize(
      embeddings,
      getConnection(config.url, config.table),
    );
    await vectorStore.delete({ ids, filter: options?.filter });
    await vectorStore.end();
  }

  /**
   * Get embeddings model instance based on configuration
   * @returns OpenAI embeddings instance
   * @throws VectorDatabaseException if embeddings model not configured
   */
  private getEmbeddings() {
    const config = this.getConfig();

    if (config.openai) {
      return new OpenAIEmbeddings({
        apiKey: config.openai.key,
        batchSize: 512,
        model: config.openai.model,
      });
    }

    throw new VectorDatabaseException('Embeddings model not found');
  }
}
