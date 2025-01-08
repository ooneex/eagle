/**
 * @module header
 *
 * @example
 * ```ts
 * import { Header } from 'eagle';
 *
 * // Creating and manipulating headers
 * const headers = new Header();
 * headers.set('Content-Type', 'application/json');
 * headers.set('Authorization', 'Bearer token123');
 *
 * const contentType = headers.get('Content-Type');
 * headers.delete('Authorization');
 * ```
 *
 * @example
 * ```ts
 * // Using readonly headers
 * import { ReadonlyHeader } from 'eagle';
 *
 * const headers = new Header();
 * headers.set('X-API-Key', 'secret');
 *
 * const readonlyHeaders = new ReadonlyHeader(headers);
 * // readonlyHeaders.set() // This would throw an error
 * const apiKey = readonlyHeaders.get('X-API-Key');
 * ```
 *
 * @example
 * ```ts
 * // Using header checker for validation
 * import { HeaderChecker } from 'eagle';
 *
 * const checker = new HeaderChecker();
 * const headers = new Header();
 *
 * // Check if required headers are present
 * const requiredHeaders = ['Authorization', 'Content-Type'];
 * if (checker.hasAll(headers, requiredHeaders)) {
 *   // Process the request
 * } else {
 *   throw new Exception('Missing required headers', 'INVALID_HEADERS', 400);
 * }
 * ```
 */

export { Header } from './Header.ts';
export { HeaderChecker } from './HeaderChecker.ts';
export { ReadonlyHeader } from './ReadonlyHeader.ts';
export * from './types.ts';
