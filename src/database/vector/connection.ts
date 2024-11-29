import type { DistanceStrategy } from 'npm:@langchain/community/vectorstores/pgvector';
import type { PoolConfig } from 'npm:pg';

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
