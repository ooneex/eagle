import type { DistanceStrategy } from 'npm:@langchain/community/vectorstores/pgvector';
import type { PoolConfig } from 'npm:pg';

/**
 * Creates a Postgres connection configuration object for vector storage
 * @param dbUrl The postgres database connection URL
 * @param tableName The name of the table to store vectors in
 * @returns Connection configuration object with postgres options, table details and vector storage settings
 */
export const getConnection = (dbUrl: string, tableName: string) => {
  return {
    postgresConnectionOptions: {
      type: 'postgres',
      connectionString: dbUrl,
    } as PoolConfig,
    tableName,
    columns: {
      idColumnName: 'id',
      vectorColumnName: 'vector',
      contentColumnName: 'content',
      metadataColumnName: 'metadata',
    },
    distanceStrategy: 'cosine' as DistanceStrategy,
  };
};
