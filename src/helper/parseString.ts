import { trim } from './trim.ts';

/**
 * Parse a string into appropriate data type.
 *
 * @param text The input string to parse
 * @returns Parsed value as type T
 *
 * Handles the following formats:
 * - Integers (e.g. "123" -> 123)
 * - Floating point numbers (e.g. "12.34" -> 12.34)
 * - Booleans ("true"/"false" -> true/false)
 * - null ("null" -> null)
 * - Arrays (e.g. "[1, 2, 3]" -> [1, 2, 3])
 * - Valid JSON
 * - Plain strings (if no other format matches)
 */
export const parseString = <T = unknown>(text: string): T => {
  if (/^[0-9]+$/.test(text)) {
    return Number.parseInt(text, 10) as T;
  }

  if (/^[0-9]+[.][0-9]+$/.test(text)) {
    return Number.parseFloat(text) as T;
  }

  if (/^true$/i.test(text)) {
    return true as T;
  }

  if (/^false$/i.test(text)) {
    return false as T;
  }

  if (/^null$/i.test(text)) {
    return null as T;
  }

  if (/^\[/.test(text) && /]$/.test(text)) {
    const trimmedText = trim(text, '\\[|\\]');

    let values: unknown[] = trimmedText.split(/, */);

    values = values.map((value) => {
      return parseString(value as string);
    });

    return values as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};
