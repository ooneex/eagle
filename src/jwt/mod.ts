/**
 * JSON Web Token (JWT) module providing functionality for creating, signing, and verifying JWTs.
 * Supports various algorithms, custom options, and secure token handling.
 *
 * @module jwt
 *
 * @example
 * ```ts
 * import { Jwt } from 'eagle';
 *
 * // Creating and signing a JWT
 * const jwt = new Jwt();
 * const payload = { userId: '123', role: 'admin' };
 * const token = await jwt.sign(payload, 'secret-key');
 * ```
 *
 * @example
 * ```ts
 * // Verifying and decoding a JWT
 * const jwt = new Jwt();
 * try {
 *   const payload = await jwt.verify(token, 'secret-key');
 *   console.log(payload.userId); // '123'
 *   console.log(payload.role); // 'admin'
 * } catch (error) {
 *   // Handle invalid token
 *   throw new Exception('Invalid token', 'INVALID_TOKEN', 401);
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using JWT with custom options
 * const jwt = new Jwt({
 *   expiresIn: '1h',
 *   algorithm: 'HS256',
 *   issuer: 'api.example.com'
 * });
 *
 * const token = await jwt.sign(payload, 'secret-key');
 * ```
 *
 * @example
 * ```ts
 * // Extracting JWT from Authorization header
 * const headers = new Header();
 * headers.set('Authorization', 'Bearer ' + token);
 *
 * const authHeader = headers.get('Authorization');
 * if (authHeader?.startsWith('Bearer ')) {
 *   const token = authHeader.slice(7);
 *   const payload = await jwt.verify(token, 'secret-key');
 * }
 * ```
 */

export { Jwt } from './Jwt.ts';
export * from './types.ts';
