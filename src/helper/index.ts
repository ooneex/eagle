/**
 * @module helper
 *
 * @example
 * ```ts
 * import { parseString } from 'eagle';
 *
 * // Parse string to specific type
 * const numberValue = parseString('123', 'number'); // Returns 123
 * const boolValue = parseString('true', 'boolean'); // Returns true
 * const dateValue = parseString('2023-01-01', 'date'); // Returns Date object
 * ```
 *
 * @example
 * ```ts
 * import { trim } from 'eagle';
 *
 * // Trim whitespace and special characters
 * const text = '  Hello World!  \n';
 * const trimmed = trim(text); // Returns 'Hello World!'
 *
 * // Trim specific characters
 * const customText = '...Hello World!!!';
 * const customTrimmed = trim(customText, '.!'); // Returns 'Hello World'
 * ```
 *
 * @example
 * ```ts
 * // Combining helper functions
 * const rawInput = '  123.45  ';
 * const parsedNumber = parseString(trim(rawInput), 'number'); // Returns 123.45
 * ```
 */

export { parseString } from './parseString.ts';
export { trim } from './trim.ts';
