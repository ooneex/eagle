/**
 * Configuration module for Eagle applications.
 *
 * This module provides configuration management through decorators and environment variables.
 * It allows type-safe configuration injection and validation.
 *
 * @module config
 *
 * @example
 * ```ts
 * import { Config, EnvConfig } from 'eagle';
 *
 * // Define configuration class
 * class AppConfig extends EnvConfig {
 *   @Config('PORT', { type: 'number', default: 3000 })
 *   port!: number;
 *
 *   @Config('HOST')
 *   host!: string;
 * }
 *
 * // Load and validate config
 * const config = new AppConfig();
 * await config.load();
 * ```
 *
 * @example
 * ```ts
 * // Using config in a service
 * import { Injectable } from 'eagle';
 *
 * @Injectable()
 * class ServerService {
 *   constructor(private config: AppConfig) {}
 *
 *   start() {
 *     const server = new Server({
 *       port: this.config.port,
 *       host: this.config.host
 *     });
 *     return server.listen();
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Config validation and defaults
 * class DatabaseConfig extends EnvConfig {
 *   @Config('DB_HOST', { required: true })
 *   host!: string;
 *
 *   @Config('DB_PORT', {
 *     type: 'number',
 *     default: 5432,
 *     validate: (port) => port > 0 && port < 65536
 *   })
 *   port!: number;
 * }
 * ```
 */

export { ConfigDecoratorException } from './ConfigDecoratorException.ts';
export * from './decorators.ts';
export { EnvConfig } from './EnvConfig.ts';
export * from './types.ts';
