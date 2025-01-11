import { beforeEach, describe, expect, it } from 'bun:test';
import {
  ControllerContainer,
  ControllerNotFoundException,
  type IController,
  Route,
  findRoute,
} from '@/controller';

beforeEach(() => {
  ControllerContainer.clear();
});

describe('findRoute', () => {
  it('should find a matching route', () => {
    @Route.path('/test', 'GET')
    class TestController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const result = findRoute({
      path: '/test',
      method: 'GET',
      host: '',
      ip: '',
    });

    expect(result.name).toBe(TestController.name);
    expect(result.path).toEqual(['/test']);
    expect(result.method).toEqual(['GET']);
  });

  it('should throw ControllerNotFoundException when route not found', () => {
    expect(() =>
      findRoute({
        path: '/nonexistent',
        method: 'GET',
        host: '',
        ip: '',
      }),
    ).toThrow(ControllerNotFoundException);
  });

  it('should throw ControllerNotFoundException when method not allowed', () => {
    @Route.path('/test', 'GET')
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class TestController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    expect(() =>
      findRoute({
        path: '/test',
        method: 'POST',
        host: '',
        ip: '',
      }),
    ).toThrow(ControllerNotFoundException);
  });

  it('should extract path parameters', () => {
    @Route.path('/users/:id', 'GET')
    // biome-ignore lint/correctness/noUnusedVariables: trust me
    class TestController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const result = findRoute({
      path: '/users/123',
      method: 'GET',
      host: '',
      ip: '',
    });

    expect(result.params).toEqual({ id: '123' });
  });

  it('should validate host restrictions', () => {
    @Route.path('/test', 'GET', { host: ['example.com'] })
    class TestController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    expect(() =>
      findRoute({
        path: '/test',
        method: 'GET',
        host: 'wrong.com',
        ip: '',
      }),
    ).toThrow(ControllerNotFoundException);

    const result = findRoute({
      path: '/test',
      method: 'GET',
      host: 'example.com',
      ip: '',
    });

    expect(result.name).toBe(TestController.name);
  });

  it('should validate IP restrictions', () => {
    @Route.path('/test', 'GET', { ip: ['127.0.0.1'] })
    class TestController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    expect(() =>
      findRoute({
        path: '/test',
        method: 'GET',
        host: '',
        ip: '192.168.1.1',
      }),
    ).toThrow(ControllerNotFoundException);

    const result = findRoute({
      path: '/test',
      method: 'GET',
      host: '',
      ip: '127.0.0.1',
    });

    expect(result.name).toBe(TestController.name);
  });
});
