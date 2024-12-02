/**
 * Middleware module providing request/response processing pipeline functionality.
 * Supports both global and route-specific middleware with flexible configuration options.
 *
 * @module middleware
 *
 * @example
 * ```ts
 * import { middleware } from 'eagle';
 *
 * // Basic middleware
 * @middleware()
 * class AuthMiddleware {
 *   async handle(request: Request, next: Next) {
 *     // Verify authentication
 *     if (!request.headers.get('Authorization')) {
 *       throw new Error('Unauthorized');
 *     }
 *     return next(request);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Middleware with configuration
 * @middleware()
 * class RateLimitMiddleware {
 *   private limit: number;
 *
 *   constructor(limit: number = 100) {
 *     this.limit = limit;
 *   }
 *
 *   async handle(request: Request, next: Next) {
 *     // Check rate limit
 *     if (await this.isRateLimitExceeded(request)) {
 *       throw new Error('Rate limit exceeded');
 *     }
 *     return next(request);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using middleware in controllers
 * @controller()
 * class UserController {
 *   @middleware([AuthMiddleware, RateLimitMiddleware])
 *   @get('/users')
 *   async getUsers() {
 *     // Protected route
 *     return new Response('Users list');
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Global middleware registration
 * app.use(new LoggerMiddleware());
 * app.use(new CorsMiddleware({
 *   allowOrigin: '*',
 *   allowMethods: ['GET', 'POST']
 * }));
 * ```
 */

export * from './decorators.ts';
export { MiddlewareDecoratorException } from './MiddlewareDecoratorException.ts';
export * from './types.ts';
