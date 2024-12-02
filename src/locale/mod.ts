/**
 * Locale module providing internationalization and localization functionality.
 * Supports multiple languages, date/time formatting, and number formatting.
 *
 * @module locale
 *
 * @example
 * ```ts
 * import { Locale } from 'eagle';
 *
 * // Set the current locale
 * Locale.set('fr-FR');
 *
 * // Format numbers according to locale
 * const number = 1234567.89;
 * console.log(Locale.formatNumber(number)); // '1 234 567,89'
 * ```
 *
 * @example
 * ```ts
 * // Format dates according to locale
 * const date = new Date('2023-12-25');
 * console.log(Locale.formatDate(date)); // '25 décembre 2023'
 * ```
 *
 * @example
 * ```ts
 * // Format currency according to locale
 * const price = 42.99;
 * console.log(Locale.formatCurrency(price, 'EUR')); // '42,99 €'
 * ```
 *
 * @example
 * ```ts
 * // Get localized strings
 * const message = Locale.getString('welcome');
 * console.log(message); // 'Bienvenue'
 *
 * // String with parameters
 * const greeting = Locale.getString('hello', { name: 'Marie' });
 * console.log(greeting); // 'Bonjour Marie'
 * ```
 */

export * from './locales.ts';
