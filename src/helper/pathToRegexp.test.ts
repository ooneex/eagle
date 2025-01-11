import { describe, expect, it } from 'bun:test';
import { pathToRegexp } from '@/helper';

describe('pathToRegexp', () => {
  it('should convert simple path to regexp', () => {
    const regexp = pathToRegexp('/users');
    expect(regexp.test('/users')).toBe(true);
    expect(regexp.test('/users/')).toBe(false);
    expect(regexp.test('/users/123')).toBe(false);
  });

  it('should convert path with parameters to regexp', () => {
    const regexp = pathToRegexp('/users/:id');
    expect(regexp.test('/users/123')).toBe(true);
    expect(regexp.test('/users/abc')).toBe(true);
    expect(regexp.test('/users/')).toBe(false);
    expect(regexp.test('/users/123/posts')).toBe(false);
  });

  it('should capture named parameters', () => {
    const regexp = pathToRegexp('/users/:id/posts/:postId');
    const match = '/users/123/posts/456'.match(regexp);

    expect(match?.groups).toEqual({
      id: '123',
      postId: '456',
    });
  });

  it('should handle multiple parameters', () => {
    const regexp = pathToRegexp('/api/:version/users/:userId/posts/:postId');
    const match = '/api/v1/users/123/posts/456'.match(regexp);

    expect(match?.groups).toEqual({
      version: 'v1',
      userId: '123',
      postId: '456',
    });
  });

  it('should not match paths with extra segments', () => {
    const regexp = pathToRegexp('/users/:id');
    expect(regexp.test('/users/123/extra')).toBe(false);
  });
});
