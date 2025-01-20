import { splitToWords } from './utils';

export function toSnakeCase(input: string): string {
  input = input.trim();
  return splitToWords(input).join('_').toLowerCase();
}
