/**
 * Logger module providing flexible logging functionality with different log levels,
 * formatting options, and output destinations.
 *
 * @module logger
 *
 * @example
 * ```ts
 * import { Logger } from 'eagle';
 *
 * // Basic logging
 * const logger = new Logger();
 * logger.info('Application started');
 * logger.error('An error occurred', new Error('Database connection failed'));
 * ```
 *
 * @example
 * ```ts
 * // Logging with custom options
 * const logger = new Logger({
 *   level: 'debug',
 *   format: 'json',
 *   timestamp: true
 * });
 *
 * logger.debug('Debugging information');
 * logger.warn('Warning message');
 * ```
 *
 * @example
 * ```ts
 * // Logging with context
 * const logger = new Logger();
 *
 * logger.info('User logged in', {
 *   userId: '123',
 *   ip: '192.168.1.1',
 *   timestamp: new Date()
 * });
 * ```
 *
 * @example
 * ```ts
 * // Using different log levels
 * logger.debug('Debug message'); // Only shown when debug level is enabled
 * logger.info('Info message');   // General information
 * logger.warn('Warning');        // Warning conditions
 * logger.error('Error');         // Error conditions
 * logger.fatal('Fatal error');   // System is unusable
 * ```
 */

export * from './Logger.ts';
