/**
 * Dependency injection container module for managing application services.
 *
 * This module provides dependency injection capabilities through a container that manages
 * service instantiation and lifecycle.
 *
 * @module container
 *
 * @example
 * ```ts
 * import { Container } from './container/mod.ts';
 *
 * // Create a container instance
 * const container = new Container();
 *
 * // Register a service
 * container.register('database', Database);
 *
 * // Resolve instance
 * const db = container.resolve('database');
 * ```
 *
 * @example
 * ```ts
 * // Using decorators for dependency injection
 * import { Injectable } from 'eagle';
 *
 * @Injectable()
 * class UserService {
 *   constructor(private db: Database) {}
 *
 *   async getUsers() {
 *     return this.db.query('SELECT * FROM users');
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Singleton services
 * import { container } from './container/mod.ts';
 *
 * @Injectable({ singleton: true })
 * class ConfigService {
 *   private config: Record<string, unknown>;
 *
 *   async load() {
 *     this.config = await loadConfig();
 *   }
 *
 *   get(key: string) {
 *     return this.config[key];
 *   }
 * }
 *
 * // Same instance across the app
 * const config1 = container.resolve(ConfigService);
 * const config2 = container.resolve(ConfigService);
 * // config1 === config2
 * ```
 */

export { Container, container } from './Container.ts';
export { ContainerException } from './ContainerException.ts';
export * from './resolve.ts';
export * from './types.ts';
