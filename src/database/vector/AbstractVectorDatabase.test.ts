import { expect } from '@std/expect';
import { beforeEach, describe, it } from '@std/testing/bdd';
import { assertSpyCalls, stub } from '@std/testing/mock';
import { AbstractVectorDatabase, VectorDatabaseConfigType } from '../mod.ts';

class TestVectorDatabase extends AbstractVectorDatabase {
  private config: VectorDatabaseConfigType;

  constructor(config: VectorDatabaseConfigType) {
    super();
    this.config = config;
  }

  getConfig(): VectorDatabaseConfigType {
    return this.config;
  }
}

describe('AbstractVectorDatabase', () => {
  let database: TestVectorDatabase;
  const mockConfig: VectorDatabaseConfigType = {
    url: 'postgresql://test:test@localhost:5432/test',
    table: 'test_vectors',
    openai: {
      key: 'test-key',
      model: 'text-embedding-3-small',
    },
  };

  beforeEach(() => {
    database = new TestVectorDatabase(mockConfig);
  });

  describe('find', () => {
    it('should find documents with default options', async () => {
      const findStub = stub(database, 'find');
      await database.find('test query');
      assertSpyCalls(findStub, 1);
    });

    it('should find documents with custom options', async () => {
      const findStub = stub(database, 'find');
      await database.find('test query', { k: 5 });
      assertSpyCalls(findStub, 1);
    });
  });

  describe('add', () => {
    it('should add documents', async () => {
      const addStub = stub(database, 'add');
      await database.add([{
        id: 'test-id',
        pageContent: 'test content',
        metadata: {},
      }]);
      assertSpyCalls(addStub, 1);
    });

    it('should add documents with metadata', async () => {
      const addStub = stub(database, 'add');
      await database.add([{
        id: 'test-id',
        pageContent: 'test content',
        metadata: { source: 'test' },
      }]);
      assertSpyCalls(addStub, 1);
    });
  });

  describe('delete', () => {
    it('should delete documents by ids', async () => {
      const deleteStub = stub(database, 'delete');
      await database.delete(['test-id']);
      assertSpyCalls(deleteStub, 1);
    });

    it('should delete documents with filter', async () => {
      const deleteStub = stub(database, 'delete');
      await database.delete(undefined, { filter: { source: 'test' } });
      assertSpyCalls(deleteStub, 1);
    });

    it('should delete documents with both ids and filter', async () => {
      const deleteStub = stub(database, 'delete');
      await database.delete(['test-id'], { filter: { source: 'test' } });
      assertSpyCalls(deleteStub, 1);
    });
  });

  describe('getConfig', () => {
    it('should return the config', () => {
      const config = database.getConfig();
      expect(config).toEqual(mockConfig);
    });
  });
});
