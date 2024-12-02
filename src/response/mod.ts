/**
 * Response module providing flexible HTTP response handling with support for different
 * content types, status codes, headers, and response formats.
 *
 * @module response
 *
 * @example
 * ```ts
 * import { HttpResponse } from 'eagle';
 *
 * // Basic response
 * const response = new HttpResponse()
 *   .status(200)
 *   .json({ message: 'Success' });
 * ```
 *
 * @example
 * ```ts
 * // Response with custom headers and cookies
 * const response = new HttpResponse()
 *   .status(201)
 *   .header('X-Custom-Header', 'value')
 *   .cookie('session', 'abc123', { httpOnly: true })
 *   .json({ id: 1, name: 'User' });
 * ```
 *
 * @example
 * ```ts
 * // Different response types
 * // JSON response
 * const jsonResponse = new HttpResponse()
 *   .json({ data: 'value' });
 *
 * // Text response
 * const textResponse = new HttpResponse()
 *   .text('Hello World');
 *
 * // HTML response
 * const htmlResponse = new HttpResponse()
 *   .html('<h1>Hello World</h1>');
 * ```
 *
 * @example
 * ```ts
 * // Error responses
 * const errorResponse = new HttpResponse()
 *   .status(400)
 *   .json({
 *     error: 'Bad Request',
 *     message: 'Invalid input data'
 *   });
 *
 * // Not Found response
 * const notFoundResponse = new HttpResponse()
 *   .status(404)
 *   .json({
 *     error: 'Not Found',
 *     message: 'Resource not found'
 *   });
 * ```
 */

export { HttpResponse } from './HttpResponse.ts';
export * from './types.ts';
