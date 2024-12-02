/**
 * Security module providing authentication, authorization, and user management functionality.
 * Includes support for role-based access control, permissions, and user authentication.
 *
 * @module security
 *
 * @example
 * ```ts
 * import { Auth } from 'eagle';
 *
 * // Basic authentication
 * const auth = new Auth();
 * const user = await auth.authenticate(request);
 *
 * if (user) {
 *   console.log('Authenticated user:', user.email);
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using role-based access control
 * @controller()
 * class AdminController {
 *   @permission(['admin'])
 *   @get('/admin/users')
 *   async getUsers() {
 *     // Only users with admin role can access
 *     return new Response('Admin panel');
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Custom permission checks
 * const user = await auth.authenticate(request);
 *
 * if (await user.hasPermission('manage_users')) {
 *   // User has permission to manage users
 *   await user.updateRole('editor');
 * } else {
 *   throw new UnauthorizedException('Insufficient permissions');
 * }
 * ```
 *
 * @example
 * ```ts
 * // Role and permission management
 * const role = new Role('moderator');
 * await role.addPermission('edit_posts');
 * await role.addPermission('delete_comments');
 *
 * const user = await User.find(1);
 * await user.assignRole('moderator');
 *
 * // Check permissions
 * if (await user.hasRole('moderator')) {
 *   console.log('User is a moderator');
 * }
 * ```
 */

export { Auth } from './Auth.ts';
export * from './decorators.ts';
export { Permission } from './Permission.ts';
export { PermissionDecoratorException } from './PermissionDecoratorException.ts';
export { PermissionException } from './PermissionException.ts';
export { Role } from './Role.ts';
export * from './types.ts';
export { UnauthorizedException } from './UnauthorizedException.ts';
export { User } from './User.ts';
export * from './utils.ts';
