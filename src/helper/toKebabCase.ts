import { splitToWords } from './utils.ts';

export const toKebabCase = (input: string): string => {
  input = input.trim();
  return splitToWords(input).join('-').toLocaleLowerCase();
};
