/**
 * Controller module providing decorators and utilities for handling HTTP requests.
 *
 * This module contains decorators for defining controllers and route handlers,
 * as well as utilities for parameter binding and response handling.
 *
 * @module controller
 *
 * @example
 * ```ts
 * import { Controller, Get, Post } from 'eagle';
 *
 * @Controller('/users')
 * class UserController {
 *   @Get('/')
 *   getUsers() {
 *     return { users: [] };
 *   }
 *
 *   @Post('/')
 *   createUser(@Body() data: CreateUserDto) {
 *     return { id: 1, ...data };
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Using path parameters and query strings
 * @Controller()
 * class ProductController {
 *   @Get('/products/:id')
 *   getProduct(@Param('id') id: string, @Query('fields') fields?: string) {
 *     return { id, fields };
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Dependency injection in controllers
 * @Controller()
 * class OrderController {
 *   constructor(private orderService: OrderService) {}
 *
 *   @Post('/orders')
 *   async createOrder(@Body() order: CreateOrderDto) {
 *     return await this.orderService.create(order);
 *   }
 *
 *   @Get('/orders/:id')
 *   async getOrder(@Param('id') id: string) {
 *     return await this.orderService.findById(id);
 *   }
 * }
 * ```
 */

export * from './container.ts';
export { ControllerActionException } from './ControllerActionException.ts';
export { DecoratorException } from './DecoratorException.ts';
export * from './decorators.ts';
export * from './types.ts';
export * from './utils.ts';
