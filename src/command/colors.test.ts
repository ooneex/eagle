import { describe, expect, test } from 'bun:test';
import { bold, getColorEnabled, reset, setColorEnabled } from './colors';

describe('colors', () => {
  describe('color enabling', () => {
    test('should allow enabling/disabling colors', () => {
      setColorEnabled(false);
      expect(getColorEnabled()).toBe(false);

      setColorEnabled(true);
      expect(getColorEnabled()).toBe(true);
    });
  });

  describe('text formatting', () => {
    test('should reset text formatting', () => {
      setColorEnabled(true);
      // biome-ignore lint/suspicious/noControlCharactersInRegex: trust me
      expect(reset('test')).toMatch(/\x1b\[0m$/);

      setColorEnabled(false);
      expect(reset('test')).toBe('test');
    });

    test('should make text bold', () => {
      setColorEnabled(true);
      // biome-ignore lint/suspicious/noControlCharactersInRegex: trust me
      expect(bold('test')).toMatch(/\x1b\[1m/);

      setColorEnabled(false);
      expect(bold('test')).toBe('test');
    });
  });
});
