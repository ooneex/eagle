/**
 * Maps time unit abbreviations to their equivalent in seconds.
 *
 * @example
 * s: 1 second
 * m: 60 seconds (1 minute)
 * h: 3600 seconds (1 hour)
 * d: 86400 seconds (1 day)
 * w: 604800 seconds (1 week)
 * y: 31536000 seconds (1 year)
 */
export const unitMapper: Record<string, number> = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800,
  y: 31536000,
};
