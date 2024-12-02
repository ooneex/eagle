/**
 * Database module providing database connectivity, repositories, and vector database capabilities.
 *
 * This module handles database connections, repository patterns, and specialized vector database
 * functionality for similarity searches and embeddings.
 *
 * @module database
 *
 * @example
 * ```ts
 * import { Repository } from 'eagle';
 *
 * @Repository()
 * class UserRepository {
 *   async findById(id: string) {
 *     return await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
 *   }
 *
 *   async create(data: CreateUserDto) {
 *     return await this.db.insert('users', data);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using vector database for similarity search
 * import { VectorRepository } from 'eagle';
 *
 * @VectorRepository()
 * class DocumentRepository {
 *   async findSimilar(embedding: number[], limit = 10) {
 *     return await this.vectorDb.search('documents', {
 *       vector: embedding,
 *       limit
 *     });
 *   }
 *
 *   async store(document: Document, embedding: number[]) {
 *     return await this.vectorDb.insert('documents', {
 *       ...document,
 *       embedding
 *     });
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Database configuration
 * import { Database } from 'eagle';
 *
 * @Database({
 *   type: 'postgres',
 *   host: 'localhost',
 *   port: 5432,
 *   username: 'user',
 *   password: 'pass',
 *   database: 'myapp'
 * })
 * class AppDatabase {
 *   async connect() {
 *     await this.client.connect();
 *   }
 *
 *   async disconnect() {
 *     await this.client.end();
 *   }
 * }
 * ```
 */

export { DatabaseDecoratorException } from './DatabaseDecoratorException.ts';
export * from './decorators.ts';
export { RepositoryDecoratorException } from './RepositoryDecoratorException.ts';
export * from './types.ts';
export { AbstractVectorDatabase } from './vector/AbstractVectorDatabase.ts';
export { VectorDatabaseDecoratorException } from './vector/VectorDatabaseDecoratorException.ts';
export { VectorDatabaseException } from './vector/VectorDatabaseException.ts';
