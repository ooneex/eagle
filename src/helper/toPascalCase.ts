import { capitalizeWord } from './capitalizeWord';
import { splitToWords } from './utils';

export const toPascalCase = (input: string): string => {
  input = input.trim();
  return splitToWords(input).map(capitalizeWord).join('');
};
