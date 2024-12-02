/**
 * Request module providing HTTP request handling functionality with support for
 * different content types, file uploads, and request validation.
 *
 * @module request
 *
 * @example
 * ```ts
 * import { HttpRequest } from 'eagle';
 *
 * // Access request data
 * const request = new HttpRequest();
 * const userId = request.params.get('id');
 * const searchQuery = request.query.get('q');
 * const requestBody = request.body;
 * ```
 *
 * @example
 * ```ts
 * // Handle file uploads
 * const request = new HttpRequest();
 * const uploadedFile = request.files.get('avatar');
 *
 * if (uploadedFile) {
 *   console.log('File name:', uploadedFile.name);
 *   console.log('File size:', uploadedFile.size);
 *   console.log('MIME type:', uploadedFile.type);
 *   await uploadedFile.saveTo('/uploads');
 * }
 * ```
 *
 * @example
 * ```ts
 * // Access request headers and metadata
 * const request = new HttpRequest();
 * const userAgent = request.headers.get('user-agent');
 * const contentType = request.headers.get('content-type');
 * const method = request.method;
 * const url = request.url;
 * ```
 *
 * @example
 * ```ts
 * // Parse different content types
 * const request = new HttpRequest();
 *
 * if (request.is('application/json')) {
 *   const jsonData = request.body;
 * } else if (request.is('multipart/form-data')) {
 *   const formData = request.form;
 * } else if (request.is('application/x-www-form-urlencoded')) {
 *   const formData = request.form;
 * }
 * ```
 */

export { HttpRequest } from './HttpRequest.ts';
export { RequestFile } from './RequestFile.ts';
export * from './types.ts';
