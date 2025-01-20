import { capitalizeWord, splitToWords } from './utils';

export function toPascalCase(input: string): string {
  input = input.trim();
  return splitToWords(input).map(capitalizeWord).join('');
}
