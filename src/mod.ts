/**
 * A TypeScript module for working with primitive scalar values.
 *
 * This module provides type definitions and utilities for handling basic scalar types
 * like boolean, number, bigint and string values.
 *
 * @module eagle
 *
 * @example
 * import { ScalarType } from './mod.ts';
 *
 * // Examples of valid scalar values
 * const booleanValue: ScalarType = true;
 * const numberValue: ScalarType = 42;
 * const bigintValue: ScalarType = BigInt(9007199254740991);
 * const stringValue: ScalarType = "Hello world";
 *
 * // Type checking
 * function processScalar(value: ScalarType) {
 *   if (typeof value === "string") {
 *     return value.toUpperCase();
 *   }
 *   return String(value);
 * }
 */

export * from './types.ts';
