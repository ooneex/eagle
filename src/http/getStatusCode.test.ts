import { getStatusCode } from '@/http/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('getStatusCode', () => {
  it('should return 200 for successful responses', () => {
    expect(getStatusCode('OK')).toBe(200);
  });

  it('should return 404 for not found', () => {
    expect(getStatusCode('NotFound')).toBe(404);
  });

  it('should return 500 for server errors', () => {
    expect(getStatusCode('InternalServerError')).toBe(500);
  });

  it('should return undefined for unknown status', () => {
    // @ts-ignore: trust me
    expect(getStatusCode('UnknownStatus')).toBeUndefined();
  });
});
