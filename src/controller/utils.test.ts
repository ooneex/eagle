import {
  ControllerContainer,
  findController,
  pathToRegexp,
  StoreControllerValueType,
} from '@/controller/mod.ts';
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

describe('findController', () => {
  it('should find controller by exact path match', () => {
    const mockController: StoreControllerValueType = {
      name: 'test',
      paths: ['/users'],
      methods: ['GET'],
    };
    ControllerContainer.add('test', mockController);

    const req = new Request('http://localhost/users', {
      method: 'GET',
    });
    const result = findController(req);

    expect(result).toEqual(mockController);
    ControllerContainer.clear();
  });

  it('should find controller by regexp path match', () => {
    const mockController: StoreControllerValueType = {
      name: 'test',
      regexp: [/^\/users\/\d+$/],
      methods: ['GET'],
    };
    ControllerContainer.add('test', mockController);

    const req = new Request('http://localhost/users/123', {
      method: 'GET',
    });
    const result = findController(req);

    expect(result).toEqual(mockController);
    ControllerContainer.clear();
  });

  it('should find controller with matching host', () => {
    const mockController: StoreControllerValueType = {
      name: 'test',
      paths: ['/users'],
      methods: ['GET'],
      hosts: ['test.com'],
    };
    ControllerContainer.add('test', mockController);

    const req = new Request('http://test.com/users', {
      method: 'GET',
      headers: { host: 'test.com' },
    });
    const result = findController(req);

    expect(result).toEqual(mockController);
    ControllerContainer.clear();
  });

  it('should find controller with matching IP', () => {
    const mockController: StoreControllerValueType = {
      name: 'test',
      paths: ['/users'],
      methods: ['GET'],
      ips: ['127.0.0.1'],
    };
    ControllerContainer.add('test', mockController);

    const req = new Request('http://localhost/users', {
      method: 'GET',
      headers: { 'x-forwarded-for': '127.0.0.1' },
    });
    const result = findController(req);

    expect(result).toEqual(mockController);
    ControllerContainer.clear();
  });

  it('should return null when no matching controller found', () => {
    const req = new Request('http://localhost/nonexistent', {
      method: 'GET',
    });
    const result = findController(req);

    expect(result).toBeNull();
  });

  it('should return null when method does not match', () => {
    const mockController: StoreControllerValueType = {
      name: 'test',
      paths: ['/users'],
      methods: ['GET'],
    };
    ControllerContainer.add('test', mockController);

    const req = new Request('http://localhost/users', {
      method: 'POST',
    });
    const result = findController(req);

    expect(result).toBeNull();
    ControllerContainer.clear();
  });
});
