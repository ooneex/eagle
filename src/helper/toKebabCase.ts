import { splitToWords } from './utils';

export function toKebabCase(input: string): string {
  input = input.trim();
  return splitToWords(input).join('-').toLowerCase();
}
