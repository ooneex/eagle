/**
 * Seed module providing database seeding functionality for populating test or initial data.
 * Supports dependency injection, ordered execution, and conditional seeding.
 *
 * @module seed
 *
 * @example
 * ```ts
 * // Basic seed class
 * @seed()
 * class UserSeed {
 *   async run() {
 *     await User.create({
 *       email: 'admin@example.com',
 *       name: 'Admin User',
 *       role: 'admin'
 *     });
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Seed with dependencies
 * @seed()
 * class PostSeed {
 *   constructor(private userSeed: UserSeed) {}
 *
 *   async run() {
 *     const user = await User.first();
 *     await Post.create({
 *       title: 'First Post',
 *       content: 'Hello World',
 *       userId: user.id
 *     });
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Conditional seeding
 * @seed()
 * class TestDataSeed {
 *   async shouldRun() {
 *     return Deno.env.get('ENVIRONMENT') === 'testing';
 *   }
 *
 *   async run() {
 *     // Only runs in testing environment
 *     await TestData.generate();
 *   }
 * }
 * ```
 *
 * @example
 * ```ts
 * // Running seeds
 * const container = new SeedContainer();
 *
 * // Register seeds
 * container.register([UserSeed, PostSeed, TestDataSeed]);
 *
 * // Run all seeds
 * await container.run();
 * ```
 */

export { SeedContainer } from './container.ts';
export * from './decorators.ts';
export { Seed } from './Seed.ts';
export { SeedDecoratorException } from './SeedDecoratorException.ts';
export * from './types.ts';
