/**
 * Service module provides decorators and utilities for creating injectable services
 * in the application.
 *
 * @module service
 *
 * @example
 * ```ts
 * // Basic service definition
 * @service()
 * class UserService {
 *   async findUser(id: number) {
 *     return await User.find(id);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Service with dependencies
 * @service()
 * class EmailService {
 *   constructor(
 *     private configService: ConfigService,
 *     private loggerService: LoggerService
 *   ) {}
 *
 *   async sendEmail(to: string, subject: string, body: string) {
 *     const config = this.configService.get('email');
 *     await this.send(to, subject, body);
 *     this.loggerService.info(`Email sent to ${to}`);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using services in controllers
 * @controller()
 * class UserController {
 *   constructor(
 *     private userService: UserService,
 *     private emailService: EmailService
 *   ) {}
 *
 *   @post('/users')
 *   async createUser(data: UserData) {
 *     const user = await this.userService.create(data);
 *     await this.emailService.sendWelcomeEmail(user.email);
 *     return new HttpResponse().json(user);
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Singleton service with initialization
 * @service({ singleton: true })
 * class DatabaseService {
 *   private connection: Connection;
 *
 *   async initialize() {
 *     this.connection = await createConnection();
 *   }
 *
 *   async query(sql: string) {
 *     return this.connection.query(sql);
 *   }
 * }
 * ```
 */

export * from './decorators.ts';
export { ServiceDecoratorException } from './ServiceDecoratorException.ts';
export * from './types.ts';
