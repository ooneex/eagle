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

export type LocaleType = (typeof LOCALES)[number];
