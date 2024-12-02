/**
 * URL manipulation and validation module.
 * Provides utilities for working with URLs, including parsing, validation,
 * and manipulation of URL components.
 *
 * @module url
 *
 * @example
 * ```ts
 * // Basic URL parsing and manipulation
 * const url = new Url('https://example.com/path?query=value');
 *
 * console.log(url.hostname); // 'example.com'
 * console.log(url.pathname); // '/path'
 * console.log(url.searchParams.get('query')); // 'value'
 * ```
 *
 * @example
 * ```ts
 * // Building URLs
 * const url = new Url()
 *   .setProtocol('https')
 *   .setHostname('api.example.com')
 *   .setPathname('/users')
 *   .addSearchParam('page', '1')
 *   .addSearchParam('limit', '10');
 *
 * console.log(url.toString());
 * // https://api.example.com/users?page=1&limit=10
 * ```
 *
 * @example
 * ```ts
 * // URL validation
 * const url = new Url('https://example.com');
 *
 * if (url.isValid()) {
 *   console.log('Valid URL');
 * }
 *
 * if (url.isSecure()) {
 *   console.log('Using HTTPS protocol');
 * }
 * ```
 *
 * @example
 * ```ts
 * // Working with path segments
 * const url = new Url('https://api.example.com/v1/users/123/posts');
 *
 * const segments = url.getPathSegments();
 * // ['v1', 'users', '123', 'posts']
 *
 * url.setPathSegments(['v2', 'users', '456', 'comments']);
 * console.log(url.pathname);
 * // '/v2/users/456/comments'
 * ```
 */

export * from './types.ts';
export { Url } from './Url.ts';
