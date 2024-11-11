import { pathToRegexp } from '@/controller/mod.ts';
import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';

describe('pathToRegexp', () => {
  it('should convert simple static paths', () => {
    const regexp = pathToRegexp('/users');
    expect(regexp.test('/users')).toBe(true);
    expect(regexp.test('/users/')).toBe(false);
    expect(regexp.test('/users/123')).toBe(false);
  });

  it('should handle path parameters', () => {
    const regexp = pathToRegexp('/users/:id');
    expect(regexp.test('/users/123')).toBe(true);
    expect(regexp.test('/users/abc')).toBe(true);
    expect(regexp.test('/users/')).toBe(false);
    expect(regexp.test('/users')).toBe(false);
  });

  it('should handle multiple path parameters', () => {
    const regexp = pathToRegexp('/users/:userId/posts/:postId');
    expect(regexp.test('/users/123/posts/456')).toBe(true);
    expect(regexp.test('/users/abc/posts/def')).toBe(true);
    expect(regexp.test('/users/123/posts')).toBe(false);
    expect(regexp.test('/users/posts/456')).toBe(false);
  });

  it('should not match paths with additional segments', () => {
    const regexp = pathToRegexp('/users/:id');
    expect(regexp.test('/users/123/extra')).toBe(false);
    expect(regexp.test('/users/123/')).toBe(false);
  });

  it('should capture named parameters', () => {
    const regexp = pathToRegexp('/users/:id/posts/:postId');
    const match = '/users/123/posts/456'.match(regexp);

    expect(match?.groups).toBeDefined();
    expect(match?.groups?.id).toBe('123');
    expect(match?.groups?.postId).toBe('456');
  });
});
