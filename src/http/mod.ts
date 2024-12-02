/**
 * @module http
 *
 * @example
 * ```ts
 * import { HeaderFields, HttpMethod, Protocol } from 'eagle';
 *
 * // Using HTTP header fields
 * const headers = {
 *   [HeaderFields.CONTENT_TYPE]: 'application/json',
 *   [HeaderFields.ACCEPT]: 'application/json'
 * };
 * ```
 *
 * @example
 * ```ts
 * // Working with HTTP methods
 * const method = HttpMethod.POST;
 *
 * const request = {
 *   method,
 *   url: '/api/users',
 *   headers,
 *   body: JSON.stringify({ name: 'John Doe' })
 * };
 * ```
 *
 * @example
 * ```ts
 * // Using protocols
 * const isSecure = request.url.startsWith(Protocol.HTTPS);
 *
 * // Create URLs with specific protocols
 * const secureUrl = `${Protocol.HTTPS}://api.example.com`;
 * const wsUrl = `${Protocol.WS}://websocket.example.com`;
 * ```
 *
 * @example
 * ```ts
 * // Type checking and validation
 * import { isValidMethod, isValidProtocol } from 'eagle';
 *
 * if (isValidMethod(request.method)) {
 *   // Process the request
 * } else {
 *   throw new Exception('Invalid HTTP method', 'INVALID_METHOD', 400);
 * }
 *
 * if (isValidProtocol(url.protocol)) {
 *   // Process the URL
 * } else {
 *   throw new Exception('Invalid protocol', 'INVALID_PROTOCOL', 400);
 * }
 * ```
 */

export * from './header_fields.ts';
export * from './methods.ts';
export * from './protocols.ts';
export * from './types.ts';
