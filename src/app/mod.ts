/**
 * Module containing the Eagle web framework and related utilities.
 *
 * Eagle is a modern web framework for Deno that provides decorators and dependency injection
 * for building scalable web applications.
 *
 * @module app
 *
 * @example
 * ```ts
 * import { Eagle } from 'eagle';
 *
 * // Create a new Eagle application instance
 * const app = new Eagle();
 *
 * // Configure app settings
 * app.setConfig({
 *   port: 3000,
 *   host: 'localhost'
 * });
 *
 * // Start the server
 * await app.listen();
 * ```
 *
 * @example
 * ```ts
 * // Using decorators to create a controller
 * import { Controller, Get } from 'eagle';
 *
 * @Controller()
 * export class UserController {
 *   @Get('/users')
 *   getUsers() {
 *     return { users: [] };
 *   }
 * }
 * ```
 */

export { Eagle } from './Eagle.ts';
export * from './register.ts';
export * from './types.ts';
export * from './utils.ts';
