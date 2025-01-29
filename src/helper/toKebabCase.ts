import { splitToWords } from './utils';

export const toKebabCase = (input: string): string => {
  input = input.trim();
  return splitToWords(input).join('-').toLowerCase();
};
