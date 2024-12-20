/**
 * Database module providing database connectivity and repository capabilities.
 *
 * This module handles database connections and repository patterns.
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
