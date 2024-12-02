/**
 * Array of supported locale codes for internationalization.
 * Includes language codes in ISO 639-1 format.
 * Some locales include region codes (e.g. 'zh-tw' for Traditional Chinese).
 */
export const LOCALES = [
  'ar',
  'bg',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'eo',
  'es',
  'et',
  'eu',
  'fi',
  'fr',
  'hu',
  'hy',
  'it',
  'ja',
  'ko',
  'lt',
  'nl',
  'no',
  'pl',
  'pt',
  'ro',
  'ru',
  'sk',
  'sv',
  'th',
  'uk',
  'zh',
  'zh-tw',
] as const;

/**
 * Type representing valid locale codes derived from the LOCALES array.
 */
export type LocaleType = (typeof LOCALES)[number];
