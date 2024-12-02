/**
 * Removes specified characters from the beginning and end of a string.
 *
 * @param text - The input string to trim
 * @param char - The character to remove from start/end (defaults to space)
 * @returns The trimmed string with specified chars removed from start/end
 */
export const trim = (text: string, char = ' '): string => {
  if (['.', '[', ']', '(', ')', '+', '*', '^', '$', '?', '/'].includes(char)) {
    char = `\\${char}`;
  }

  const reg = new RegExp(`^${char}+|${char}+$`, 'g');
  return text.replace(reg, '');
};
