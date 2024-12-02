/**
 * Exception handling module providing base exception classes and custom error types.
 *
 * @module exception
 *
 * @example
 * ```ts
 * import { Exception } from 'eagle';
 *
 * // Creating custom exceptions
 * class ValidationException extends Exception {
 *   constructor(message: string) {
 *     super(message, 'VALIDATION_ERROR', 400);
 *   }
 * }
 *
 * throw new ValidationException('Invalid input data');
 * ```
 *
 * @example
 * ```ts
 * // Using built-in exceptions
 * import { NotFoundException } from 'eagle';
 *
 * class UserService {
 *   async findUser(id: string) {
 *     const user = await this.repository.findById(id);
 *     if (!user) {
 *       throw new NotFoundException(`User with id ${id} not found`);
 *     }
 *     return user;
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Exception handling in controllers
 * @Controller()
 * class UserController {
 *   @Get('/:id')
 *   async getUser(@Param('id') id: string) {
 *     try {
 *       return await this.userService.findUser(id);
 *     } catch (error) {
 *       if (error instanceof NotFoundException) {
 *         // Handle not found case
 *         throw error;
 *       }
 *       // Handle other errors
 *       throw new Exception('Internal error', 'SERVER_ERROR', 500);
 *     }
 *   }
 * }
 * ```
 */

export { Exception } from './Exception.ts';
export { NotFoundException } from './NotFoundException.ts';
export * from './types.ts';
