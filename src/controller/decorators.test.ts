import { beforeEach, describe, expect, it } from 'bun:test';
import { container } from '@/container';
import {
  ControllerContainer,
  ControllerDecoratorException,
  type IController,
  Path,
} from '@/controller';
import { ERole } from '@/security';

describe('Controller Decorator', () => {
  beforeEach(() => {
    ControllerContainer.clear();
  });

  it('should register a valid controller class in the container', () => {
    @Path('/test', 'GET')
    class TestController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const instance = container.get<TestController>(TestController);
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(TestController);

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].value).toBe(TestController);
    expect(controllers[0].paths).toEqual(['/test']);
    expect(controllers[0].methods).toEqual(['GET']);
    expect(controllers[0].name).toBe('TestController');
  });

  it('should register controller with multiple paths and methods', () => {
    @Path(['/test1', '/test2'], ['GET', 'POST'])
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class MultiController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].paths).toEqual(['/test1', '/test2']);
    expect(controllers[0].methods).toEqual(['GET', 'POST']);
  });

  it('should register controller with custom name and scope', () => {
    @Path('/custom', 'GET', { name: 'CustomName', scope: 'singleton' })
    class CustomController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].name).toBe('CustomName');

    const instance1 = container.get<CustomController>(CustomController);
    const instance2 = container.get<CustomController>(CustomController);
    expect(instance1).toBe(instance2); // Should be same instance due to singleton scope
  });

  it('should throw error if class does not implement IController', () => {
    expect(() => {
      @Path('/invalid', 'GET')
      // biome-ignore lint/correctness/noUnusedVariables: test case
      class InvalidClass {}
    }).toThrow(ControllerDecoratorException);
  });

  it('should throw error if class name does not end with Controller', () => {
    expect(() => {
      @Path('/invalid', 'GET')
      // biome-ignore lint/correctness/noUnusedVariables: test case
      class InvalidName implements IController {
        public action(): Promise<any> {
          return Promise.resolve();
        }
      }
    }).toThrow(ControllerDecoratorException);
  });

  it('should normalize paths by trimming slashes', () => {
    @Path('/test/', 'GET')
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class PathController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].paths).toEqual(['/test']);
  });

  it('should create regexp for paths', () => {
    @Path('/test/:id', 'GET')
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class RegExpController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].regexp).toBeDefined();
    expect(controllers[0].regexp?.[0]).toBeInstanceOf(RegExp);
    expect(controllers[0].regexp?.[0].test('/test/123')).toBe(true);
    expect(controllers[0].regexp?.[0].test('/test/abc')).toBe(true);
    expect(controllers[0].regexp?.[0].test('/test/')).toBe(false);
    expect(controllers[0].regexp?.[0].test('/test')).toBe(false);
  });

  it('should accept array of paths', () => {
    @Path(['/test1', '/test2/'], 'GET')
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class MultiPathController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].paths).toEqual(['/test1', '/test2']);
  });

  it('should accept array of methods', () => {
    @Path('/test', ['GET', 'POST'])
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class MultiMethodController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].methods).toEqual(['GET', 'POST']);
  });

  it('should expand wildcard method to all HTTP methods', () => {
    @Path('/test', '*')
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class WildcardMethodController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].methods).toEqual([
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'HEAD',
      'OPTIONS',
    ]);
  });

  it('should register controller in singleton scope when configured', () => {
    @Path('/test', 'GET', { scope: 'singleton' })
    class SingletonController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const instance1 = container.get(SingletonController);
    const instance2 = container.get(SingletonController);
    expect(instance1).toBe(instance2);
  });

  it('should register controller in transient scope when configured', () => {
    @Path('/test', 'GET', { scope: 'transient' })
    class TransientController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const instance1 = container.get(TransientController);
    const instance2 = container.get(TransientController);
    expect(instance1).not.toBe(instance2);
  });

  it('should register controller with host restrictions', () => {
    @Path('/test', 'GET', { hosts: ['example.com', /\.example\.com$/] })
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class HostRestrictedController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].hosts).toEqual(['example.com', /\.example\.com$/]);
  });

  it('should register controller with IP restrictions', () => {
    @Path('/test', 'GET', { ips: ['127.0.0.1', /^192\.168\./] })
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class IpRestrictedController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].ips).toEqual(['127.0.0.1', /^192\.168\./]);
  });

  it('should register controller with validators', () => {
    const validator1 = () => true;
    const validator2 = () => true;

    @Path('/test', 'GET', { validators: [validator1, validator2] })
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class ValidatedController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].validators).toEqual([validator1, validator2]);
  });

  it('should register controller with middlewares', () => {
    const middleware1 = () => true;
    const middleware2 = () => true;

    @Path('/test', 'GET', { middlewares: [middleware1, middleware2] })
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class MiddlewareController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].middlewares).toEqual([middleware1, middleware2]);
  });

  it('should register controller with role restrictions', () => {
    @Path('/test', 'GET', { roles: [ERole.ADMIN, ERole.SUPER_ADMIN] })
    // biome-ignore lint/correctness/noUnusedVariables: test case
    class RoleRestrictedController implements IController {
      public action(): Promise<any> {
        return Promise.resolve();
      }
    }

    const controllers = Array.from(ControllerContainer);
    expect(controllers).toHaveLength(1);
    expect(controllers[0].roles).toEqual([ERole.ADMIN, ERole.SUPER_ADMIN]);
  });
});
