import { trim } from './trim';

export const parseString = <T = unknown>(text: string): T => {
  if (/^[0-9]+$/.test(text)) {
    return Number.parseInt(text, 10) as T;
  }

  if (/^[0-9]+[.][0-9]+$/.test(text)) {
    return Number.parseFloat(text) as T;
  }

  if (/^true$/i.test(text)) {
    return true as T;
  }

  if (/^false$/i.test(text)) {
    return false as T;
  }

  if (/^null$/i.test(text)) {
    return null as T;
  }

  if (/^\[/.test(text) && /]$/.test(text)) {
    const trimmedText = trim(text, '\\[|\\]');

    let values: unknown[] = trimmedText.split(/, */);

    values = values.map((value) => {
      return parseString(value as string);
    });

    return values as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};
