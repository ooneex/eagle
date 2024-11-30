import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { getConnection } from './connection.ts';

describe('getConnection', () => {
  it('should return correct connection configuration', () => {
    const dbUrl = 'postgresql://user:password@localhost:5432/dbname';
    const tableName = 'embeddings';

    const result = getConnection(dbUrl, tableName);

    expect(result).toEqual({
      postgresConnectionOptions: {
        type: 'postgres',
        connectionString: dbUrl,
      },
      tableName: 'embeddings',
      columns: {
        idColumnName: 'id',
        vectorColumnName: 'vector',
        contentColumnName: 'content',
        metadataColumnName: 'metadata',
      },
      distanceStrategy: 'cosine',
    });
  });

  it('should handle different table names', () => {
    const dbUrl = 'postgresql://user:password@localhost:5432/dbname';
    const tableName = 'custom_embeddings';

    const result = getConnection(dbUrl, tableName);

    expect(result.tableName).toBe('custom_embeddings');
  });
});
