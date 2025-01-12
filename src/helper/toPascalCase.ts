import { capitalizeWord, splitToWords } from './utils.ts';

export function toPascalCase(input: string): string {
  input = input.trim();
  return splitToWords(input).map(capitalizeWord).join('');
}
