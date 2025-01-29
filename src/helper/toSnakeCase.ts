import { splitToWords } from './utils';

export const toSnakeCase = (input: string): string => {
  input = input.trim();
  return splitToWords(input).join('_').toLowerCase();
};
