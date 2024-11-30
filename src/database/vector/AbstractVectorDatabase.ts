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

export abstract class AbstractVectorDatabase implements IVectorDatabase {
  public abstract getConfig(): VectorDatabaseConfigType;

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
