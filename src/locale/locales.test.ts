import { describe, expect, it } from 'bun:test';
import { LOCALES } from './locales.ts';

describe('LOCALES', () => {
  it('should contain valid locale codes', () => {
    const locales = [
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
    ];
    expect(Object.values(LOCALES) as string[]).toEqual(locales);
  });

  it('should not contain duplicates', () => {
    const uniqueLocales = new Set(LOCALES);
    expect(uniqueLocales.size).toBe(LOCALES.length);
  });
});
