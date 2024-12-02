/**
 * Documentation module that provides utilities for generating and managing documentation.
 *
 * @module doc
 *
 * @example
 * ```ts
 * import { Doc } from 'eagle';
 *
 * // Create documentation for a class
 * @Doc({
 *   description: 'User entity representing application users',
 *   example: `
 *     const user = new User();
 *     user.name = 'John Doe';
 *     user.email = 'john@example.com';
 *   `
 * })
 * class User {
 *   name: string;
 *   email: string;
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using doc container to access documentation
 * import { DocContainer } from 'eagle';
 *
 * const docs = DocContainer.getDocs();
 * const userDocs = docs.find(doc => doc.name === 'User');
 * console.log(userDocs.description);
 * console.log(userDocs.example);
 * ```
 *
 * @example
 * ```ts
 * // Adding metadata to methods
 * class UserService {
 *   @Doc({
 *     description: 'Creates a new user in the system',
 *     params: {
 *       data: 'User creation data containing name and email'
 *     },
 *     returns: 'Newly created user instance'
 *   })
 *   async createUser(data: CreateUserDto) {
 *     // Implementation
 *   }
 * }
 * ```
 */

export { DocContainer } from './container.ts';
export { Doc } from './Doc.ts';
export * from './types.ts';
