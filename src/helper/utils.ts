const CAPITALIZED_WORD_REGEXP = /\p{Lu}\p{Ll}+/u;
const ACRONYM_REGEXP = /\p{Lu}+(?=(\p{Lu}\p{Ll})|\P{L}|\b)/u;
const LOWERCASED_WORD_REGEXP = /(\p{Ll}+)/u;
const ANY_LETTERS = /\p{L}+/u;
const DIGITS_REGEXP = /\p{N}+/u;

const WORD_OR_NUMBER_REGEXP = new RegExp(
  `${CAPITALIZED_WORD_REGEXP.source}|${ACRONYM_REGEXP.source}|${LOWERCASED_WORD_REGEXP.source}|${ANY_LETTERS.source}|${DIGITS_REGEXP.source}`,
  'gu',
);

export function splitToWords(input: string) {
  return input.match(WORD_OR_NUMBER_REGEXP) ?? [];
}
